import {
    ColumnFiltersState,
    ExpandedState,
    GroupingState,
    Row,
    TableOptions,
    TableState,
    Updater,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import {
    PropsWithChildren,
    ReactElement,
    useCallback,
    useEffect,
    useState
} from 'react';
import { RowStylingEnum, useTableStyles } from './defaultTable';

import { ColumnSelectRT } from './tableUtils';
import { Filter } from './components/filter';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableKey } from '../../contracts/keys';
import { TableRow } from './components/group';
import TableRowMui from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { VisuallyHidden } from '../../components/text';
import { useTableState } from './hooks/useTableState';

interface TableProperties<T extends Record<string, unknown>>
    extends Omit<TableOptions<T>, 'getCoreRowModel'> {
    tableKey: TableKey;
    defaultGrouping: string[];
    defaultVisibilityState: Record<string, boolean>;
    children?: React.ReactNode;
    getRowStyling?: (row: Row<T>) => RowStylingEnum | undefined;
    setSelected?: (rows: Row<T>[]) => void;
    selectedIds?: number[];
    preserveSelected?: boolean;
    isLoading: boolean;
    enableSelection?: boolean;
}

export function GroupTable<T extends Record<string, unknown>>(
    props: PropsWithChildren<TableProperties<T>>
): ReactElement {
    const {
        columns,
        tableKey,
        defaultGrouping,
        defaultVisibilityState,
        children,
        getRowStyling,
        setSelected,
        preserveSelected,
        selectedIds,
        enableSelection
    } = props;
    const classes = useTableStyles();

    /**Get saved table settings */
    const [tableState, setTableState] = useTableState<TableState>(tableKey, {
        grouping: defaultGrouping,
        columnVisibility: defaultVisibilityState,
        expanded: {}
    } as TableState);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    console.log({ columnFilters });

    function updateGrouping(update: Updater<GroupingState>) {
        const grouping =
            update instanceof Function ? update(tableState.grouping) : update;
        setTableState((prev) => {
            return { ...prev, grouping };
        });
    }

    function updateVisibility(update: Updater<VisibilityState>) {
        const columnVisibility =
            update instanceof Function
                ? update(tableState.columnVisibility)
                : update;
        setTableState((prev) => {
            return { ...prev, columnVisibility };
        });
    }
    function updateExpanded(update: Updater<ExpandedState>) {
        const expanded =
            update instanceof Function ? update(tableState.expanded) : update;

        setTableState((prev) => {
            return { ...prev, expanded };
        });
    }

    /**Table instance */
    const table = useReactTable<T>({
        ...props,
        columns,
        getCoreRowModel: getCoreRowModel(),
        autoResetExpanded: false,
        state: { ...tableState, columnFilters },
        enableRowSelection: true,
        enableMultiRowSelection: true,
        enableSubRowSelection: true,
        onColumnFiltersChange: setColumnFilters,
        onGroupingChange: updateGrouping,
        onColumnVisibilityChange: updateVisibility,
        onExpandedChange: updateExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true
    });

    function getRowClassName(row: Row<T>) {
        if (getRowStyling !== undefined) {
            const className = getRowStyling(row);
            if (className !== undefined) {
                return `slk-table--${className}`;
            }
        }
        return '';
    }

    /**
     * Gets the current row being clicked from the 'data-row-index' attribute on the parent <tr>
     * element for any click event. Using this approach to avoid row re-renders whenever click handler
     * callbacks are updated
     *
     * @param target  The Target HTMLElement (event.target) that raised the event
     * @param rows    The list of sorted rows
     */
    function getRowFromEvent(target: HTMLElement, rows: Row<T>[]) {
        // skip if this is group header
        const isGroup =
            target.closest('tr')?.getAttribute('data-row-is-group-row') ?? '';
        if (isGroup) return null;

        // Skip if this is action cell
        const isAction =
            target.closest('td')?.getAttribute('data-is-action') ?? '';
        if (isAction) return null;

        const rowIndex = parseInt(
            target.closest('tr')?.getAttribute('data-row-index') ?? ''
        );

        const filteredRows = rows.filter(
            (row) => row.index === rowIndex && !row.getIsGrouped()
        );
        if (filteredRows.length) {
            // Should only be one result
            return filteredRows[0];
        }
        return null;
    }

    const [selectedRows, setSelectedRows] = useState<Row<T>[]>([]);

    useEffect(() => {
        if (selectedIds)
            setSelectedRows(
                table.getRowModel().rows.filter((r) => {
                    return selectedIds.find((o) => o === r.getValue('id'));
                })
            );
    }, [selectedIds, table]);

    /**
     * Handle Row Selection:
     *
     * 1. Click + CMD/CTRL - Select multiple rows
     * 2. Click + SHIFT - Range Select multiple rows
     * 3. Single Click - Select only one row
     */
    const handleRowSelection = useCallback(
        (event: React.MouseEvent<HTMLTableSectionElement>, row: Row<T>) => {
            // See if row is already selected
            const selectedRowIds = selectedRows?.map((r) => r.id) ?? [];
            const selectIndex = selectedRowIds.indexOf(row.id);
            const isSelected = selectIndex > -1;

            let updatedSelectedRows = [...(selectedRows ? selectedRows : [])];

            if (
                event.ctrlKey ||
                event.metaKey ||
                (preserveSelected && !event.shiftKey)
            ) {
                // 1. Click + CMD/CTRL - select multiple rows

                if (isSelected) {
                    updatedSelectedRows.splice(selectIndex, 1);
                } else {
                    updatedSelectedRows.push(row);
                }
            } else if (event.shiftKey) {
                // 2. Click + SHIFT - Range Select multiple rows

                if (selectedRows?.length) {
                    const lastSelectedRow = selectedRows[0];
                    // Calculate array indexes and reset selected rows
                    const lastIndex = table
                        .getRowModel()
                        .rows.indexOf(lastSelectedRow);
                    const currentIndex = table.getRowModel().rows.indexOf(row);

                    updatedSelectedRows = [];
                    if (lastIndex < currentIndex) {
                        for (let i = lastIndex; i <= currentIndex; i++) {
                            const selectedRow = table.getRowModel().rows[i];
                            if (!selectedRow.getIsGrouped()) {
                                updatedSelectedRows.push(selectedRow);
                            }
                        }
                    } else {
                        for (let i = currentIndex; i <= lastIndex; i++) {
                            const selectedRow = table.getRowModel().rows[i];
                            if (!selectedRow.getIsGrouped()) {
                                updatedSelectedRows.push(selectedRow);
                            }
                        }
                    }
                } else {
                    // No rows previously selected, select only current row
                    updatedSelectedRows = [row];
                }
            } else {
                // 3. Single Click - Select only one row

                if (isSelected && updatedSelectedRows.length === 1) {
                    updatedSelectedRows = [];
                } else {
                    updatedSelectedRows = [row];
                }
            }

            if (setSelected && enableSelection) {
                setSelectedRows(updatedSelectedRows);
                setSelected(updatedSelectedRows);
            }
        },
        [selectedRows, preserveSelected, setSelected, enableSelection, table]
    );

    return (
        <>
            <TableContainer component={Paper} className={classes.root}>
                <div className={classes.tools}>
                    <div className={classes.pasteTool}>{children}</div>
                    <ColumnSelectRT instance={table} />
                </div>
                <Table role="grid" size="small" aria-label="sjekkliste">
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRowMui key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableCell
                                            key={header.id}
                                            colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div>
                                                        {header.column.getCanGroup() ? (
                                                            <Tooltip
                                                                title={
                                                                    'Grupper kolonne'
                                                                }>
                                                                <TableSortLabel
                                                                    active
                                                                    {...{
                                                                        onClick:
                                                                            header.column.getToggleGroupingHandler(),
                                                                        style: {
                                                                            cursor: 'pointer'
                                                                        }
                                                                    }}
                                                                    direction={
                                                                        header.column.getIsGrouped()
                                                                            ? 'desc'
                                                                            : 'asc'
                                                                    }
                                                                    IconComponent={
                                                                        KeyboardArrowRight
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        ) : null}{' '}
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter
                                                                column={
                                                                    header.column
                                                                }
                                                                table={table}
                                                            />
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRowMui>
                        ))}
                    </TableHead>
                    <TableBody
                        onClick={(event) => {
                            const row = getRowFromEvent(
                                event.target as HTMLElement,
                                table.getRowModel().rows
                            );

                            if (row) {
                                handleRowSelection(event, row);
                            }
                        }}>
                        {props.isLoading && (
                            <tr>
                                <td
                                    colSpan={
                                        table.getVisibleFlatColumns().length
                                    }>
                                    <LinearProgress sx={{ width: '100%' }} />
                                </td>
                            </tr>
                        )}
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <TableRow<T>
                                    key={row.id}
                                    row={row}
                                    state={tableState}
                                    isSelected={
                                        !!selectedRows?.find(
                                            (r) => r.id === row.id
                                        )
                                    }
                                    rowClassName={getRowClassName(row)}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <VisuallyHidden id="rowActionDescription">
                Trykk for å velge
            </VisuallyHidden>
        </>
    );
}
