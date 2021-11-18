import {
    DataGridPro,
    GridRowModel,
    GridSortDirection,
    GridSortModel
} from '@mui/x-data-grid-pro';

import { ColumnSelect } from './tableUtils';
import { PasteButton } from '../components/clipboard';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import { useTable } from './tableContainer';

interface Data {
    id: number;
}
export enum RowStylingEnum {
    completed = 'completed',
    disabled = 'disabled',
    cut = 'cut'
}

interface BaseTableProps<T> {
    data: Array<T>;
    selectionModel?: number[] | undefined;
    onSelected?: (ids: number[]) => void;
    getRowStyling?: (row: GridRowModel) => RowStylingEnum | undefined;
}
export const BaseTable = <T extends Data>({
    data,
    selectionModel,
    onSelected,
    getRowStyling
}: BaseTableProps<T>) => {
    const { columns } = useTable();

    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'id',
            sort: 'asc' as GridSortDirection
        }
    ]);

    const handleSelect = (ids: any) => {
        if (onSelected !== undefined) {
            onSelected(ids);
        }
    };
    const classes = useTableStyles();
    return (
        <div className={classes.root}>
            <div className={classes.tools}>
                <div className={classes.pasteTool}>
                    <PasteButton />
                </div>
                <ColumnSelect />
            </div>
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
                rows={data}
                columns={columns}
                selectionModel={selectionModel}
                pageSize={25}
                pagination
                checkboxSelection
                disableSelectionOnClick
                disableColumnSelector
                autoHeight
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
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
        },
        '& .slk-table--cut': {
            backgroundColor: '#F3A712',
            '&:hover': {
                backgroundColor: '#F9D388'
            }
        }
    },
    tools: {
        display: 'flex',
        height: '4em'
    },
    pasteTool: {
        flexGrow: 1
    }
}));
