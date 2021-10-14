import {
    DataGridPro,
    GridColumns,
    GridRowData,
    GridSortDirection
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
                    localeText={{
                        // Root
                        noRowsLabel: 'Ingen rader',
                        noResultsOverlayLabel: 'Ikke noe resultat funnet.',
                        errorOverlayDefaultLabel: 'En feil har oppstått.',

                        // Density selector toolbar button text
                        toolbarDensity: 'Tetthet',
                        toolbarDensityLabel: 'Tetthet',
                        toolbarDensityCompact: 'Kompakt',
                        toolbarDensityStandard: 'Standard',
                        toolbarDensityComfortable: 'Komfortabelt',

                        // Columns selector toolbar button text
                        toolbarColumns: 'Kolonner',
                        toolbarColumnsLabel: 'Velg kolonner',

                        // Filters toolbar button text
                        toolbarFilters: 'Filtere',
                        toolbarFiltersLabel: 'Vis filtere',
                        toolbarFiltersTooltipHide: 'Gjem filtere',
                        toolbarFiltersTooltipShow: 'Vis filtere',
                        toolbarFiltersTooltipActive: (count) =>
                            count !== 1
                                ? `${count} aktive filtere`
                                : `${count} aktive filtere`,

                        // Export selector toolbar button text
                        toolbarExport: 'Eksporter',
                        toolbarExportLabel: 'Eksporter',
                        toolbarExportCSV: 'Last ned som CSV',

                        // Columns panel text
                        columnsPanelTextFieldLabel: 'Finn kolonne',
                        columnsPanelTextFieldPlaceholder: 'Kolonne tittel',
                        columnsPanelDragIconLabel: 'Omorganiser kolonner',
                        columnsPanelShowAllButton: 'Vis alle',
                        columnsPanelHideAllButton: 'Gjem alle',

                        // Filter panel text
                        filterPanelAddFilter: 'Legg til filter',
                        filterPanelDeleteIconLabel: 'Slett',
                        filterPanelOperators: 'Operatorer',
                        filterPanelOperatorAnd: 'Og',
                        filterPanelOperatorOr: 'Eller',
                        filterPanelColumns: 'Kolonner',
                        filterPanelInputLabel: 'Verdi',
                        filterPanelInputPlaceholder: 'Filter verdi',

                        // Filter operators text
                        filterOperatorContains: 'inneholder',
                        filterOperatorEquals: 'er lik',
                        filterOperatorStartsWith: 'starter med',
                        filterOperatorEndsWith: 'ender med',
                        filterOperatorIs: 'er',
                        filterOperatorNot: 'er ikke',
                        filterOperatorAfter: 'er etter',
                        filterOperatorOnOrAfter: 'er på eller etter',
                        filterOperatorBefore: 'er før',
                        filterOperatorOnOrBefore: 'er på eller før',
                        filterOperatorIsEmpty: 'er tom',
                        filterOperatorIsNotEmpty: 'er ikke tom',

                        // Filter values text
                        filterValueAny: 'noen',
                        filterValueTrue: 'sant',
                        filterValueFalse: 'usant',

                        // Column menu text
                        columnMenuLabel: 'Meny',
                        columnMenuShowColumns: 'Vis kolonner',
                        columnMenuFilter: 'Filter',
                        columnMenuHideColumn: 'Gjem',
                        columnMenuUnsort: 'Usortert',
                        columnMenuSortAsc: 'Sorter stigende',
                        columnMenuSortDesc: 'Sorter synkende',

                        // Column header text
                        columnHeaderFiltersTooltipActive: (count) =>
                            count !== 1
                                ? `${count} aktive filtere`
                                : `${count} aktive filter`,
                        columnHeaderFiltersLabel: 'Vis filter',
                        columnHeaderSortIconLabel: 'Sorter',

                        // Rows selected footer text
                        footerRowSelected: (count) =>
                            count !== 1
                                ? `${count.toLocaleString()} rader valgt`
                                : `${count.toLocaleString()} rad valgt`,

                        // Total rows footer text
                        footerTotalRows: 'Rader totalt:',

                        // Total visible rows footer text
                        footerTotalVisibleRows: (visibleCount, totalCount) =>
                            `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`,

                        // Checkbox selection text
                        checkboxSelectionHeaderName: 'Avmerkingsboks',

                        // Boolean cell text
                        booleanCellTrueLabel: 'sant',
                        booleanCellFalseLabel: 'usant',

                        // Actions cell more text
                        actionsCellMore: 'mer'
                    }}
                    componentsProps={{
                        pagination: {
                            labelRowsPerPage: 'Rader per side',
                            labelDisplayedRows: ({
                                from,
                                to,
                                count
                            }: {
                                from: number;
                                to: number;
                                count: number;
                            }) =>
                                `${from}-${to} av ${
                                    count !== -1 ? count : `mer enn ${to}`
                                }`
                        }
                    }}
                    rows={sortedData}
                    columns={columns}
                    selectionModel={selectionModel}
                    pageSize={25}
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
