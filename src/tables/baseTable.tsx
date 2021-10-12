import {
    DataGridPro,
    GridColumns,
    GridRowData,
    GridSortDirection,
    useGridApiRef
} from '@mui/x-data-grid-pro';
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
    onSelected?: (ids: number[]) => void;
    getRowStyling?: (row: GridRowData) => RowStylingEnum | undefined;
}
export const BaseTable = <T extends Data, K extends keyof T>({
    data,
    customSort,
    customSortFields,
    selectionModel,
    onSelected,
    getRowStyling
}: BaseTableProps<T, K>) => {
    const apiRef = useGridApiRef();
    const { columns } = useTable();

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
        setSortedData(data);
    }, [data]);

    // useEffect(() => {
    //     return apiRef.current.subscribeEvent(
    //         'columnResize',
    //         (params: GridColumnResizeParams) => {
    //             setMessage(
    //                 `Column ${params.colDef.headerName} resized to ${params.width}px.`
    //             );
    //         }
    //     );
    // }, [apiRef]);

    const handleSelect = (ids: any) => {
        if (onSelected !== undefined) {
            onSelected(ids);
        }
    };
    const classes = useTableStyles();
    return (
        <div className={classes.root}>
            <ColumnSelect />
            {sortedData && (
                <DataGridPro
                    apiRef={apiRef}
                    rows={sortedData}
                    columns={columns}
                    selectionModel={selectionModel}
                    pageSize={15}
                    pagination
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
