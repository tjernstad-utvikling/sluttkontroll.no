import {
    DataGrid,
    GridColumns,
    GridRowData,
    GridSortDirection
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { ColumnSelect } from './tableUtils';
import makeStyles from '@mui/styles/makeStyles';
import { useTable } from './tableContainer';

interface Data {
    id: number;
}
export enum RowStylingEnum {
    completed = 'completed',
    disabled = 'disabled'
}

interface BaseTableProps<T, K extends keyof T> {
    data: Array<T>;
    customSort: (data: T[], field: K) => T[];
    customSortFields: any[];
    selectionModel?: number[] | undefined;
    onSelected?: () => void;
    getRowStyling?: (row: GridRowData) => RowStylingEnum | undefined;
    skipShift?: boolean;
}
export const BaseTable = <T extends Data, K extends keyof T>({
    data,
    customSort,
    customSortFields,
    selectionModel,
    onSelected,
    getRowStyling,
    skipShift
}: BaseTableProps<T, K>) => {
    const { columns, apiRef } = useTable();
    const [isShift, setIsShift] = useState<boolean>(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>();
    const [sortedData, setSortedData] = useState<Array<T>>();

    function sort(
        data: T[],
        field: K,
        mode: GridSortDirection,
        columns: GridColumns
    ): T[] {
        const column = columns.find((c) => c.field === field);
        let sortedRows: T[] = [];
        if (column !== undefined && customSortFields.includes(field)) {
            sortedRows = customSort(data, field);
        } else {
            sortedRows = data
                .slice()
                .sort((a, b) =>
                    String(a[field]).localeCompare(String(b[field]))
                );
        }

        if (mode === 'desc') {
            sortedRows = sortedRows.reverse();
        }
        return sortedRows;
    }

    const handleSortMode = (sortMode: any) => {
        if (sortMode.sortModel.length === 0) {
            setSortedData(data);
            return;
        }
        const field: any = sortMode.sortModel[0].field;
        if (sortedData !== undefined) {
            setSortedData(
                sort(
                    sortedData,
                    field,
                    sortMode.sortModel[0].sort,
                    sortMode.columns
                )
            );
        }
    };

    useEffect(() => {
        const handleKey = (event: KeyboardEvent, down: boolean) => {
            if (event.key === 'Shift' && !skipShift) {
                setIsShift(down);
            }
        };
        window.addEventListener('keydown', (e) => handleKey(e, true));
        window.addEventListener('keyup', (e) => handleKey(e, false));

        // cleanup this component
        return () => {
            window.removeEventListener('keydown', (e) => handleKey(e, true));
            window.removeEventListener('keyup', (e) => handleKey(e, false));
        };
    }, [skipShift]);

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const handleSelect = (row: any) => {
        if (sortedData !== undefined) {
            const index = sortedData.findIndex((k) => k.id === row.data.id);

            if (isShift) {
                if (lastSelectedIndex === undefined) {
                    return;
                }

                if (index === lastSelectedIndex) {
                    return;
                }
                const subsetArray = sortedData.slice(
                    Math.min(index, lastSelectedIndex),
                    Math.max(index, lastSelectedIndex) + 1
                );

                const selectArray = subsetArray.map((k) => k.id);
                apiRef.current.selectRows(selectArray, row.isSelected);
            }
            if (onSelected !== undefined) {
                onSelected();
            }

            setLastSelectedIndex(index);
        }
    };
    const classes = useTableStyles();
    return (
        <div className={classes.root}>
            <ColumnSelect />
            {sortedData && (
                <DataGrid
                    rows={sortedData}
                    columns={columns}
                    selectionModel={selectionModel}
                    pageSize={15}
                    checkboxSelection
                    disableSelectionOnClick
                    disableColumnSelector
                    autoHeight
                    sortingMode="server"
                    onSortModelChange={handleSortMode}
                    onSelectionModelChange={handleSelect}
                    getRowClassName={(params) => {
                        if (getRowStyling !== undefined) {
                            const className = getRowStyling(params.row);
                            if (className !== undefined) {
                                return `slk-table--${className}`;
                            }
                        }
                        return '';
                    }}
                />
            )}
        </div>
    );
};

const useTableStyles = makeStyles((theme) => ({
    root: {
        '& .slk-table--disabled': {
            backgroundColor: '#7A7A7A',
            '&:hover': {
                backgroundColor: '#7A7A7A'
            }
        },
        '& .slk-table--completed': {
            backgroundColor: '#8FC93A',
            '&:hover': {
                backgroundColor: '#ACD76C'
            }
        }
    }
}));
