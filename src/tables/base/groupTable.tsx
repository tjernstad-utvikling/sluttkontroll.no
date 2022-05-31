import {
    Cell,
    Row,
    TableOptions,
    TableState,
    useExpanded,
    useGroupBy,
    useTable
} from 'react-table';
import {
    PropsWithChildren,
    ReactElement,
    useCallback,
    useEffect,
    useState
} from 'react';
import { RowStylingEnum, useTableStyles } from './defaultTable';

import Button from '@mui/material/Button';
import { ColumnSelectRT } from './tableUtils';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableKey } from '../../contracts/keys';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { VisuallyHidden } from '../../components/text';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface TableProperties<T extends Record<string, unknown>>
    extends TableOptions<T> {
    tableKey: TableKey;
    defaultGroupBy: string[];
    children?: React.ReactNode;
    toRenderInCustomCell: string[];
    getCustomCell?: (
        accessor: string,
        row: Row<T>,
        cell: Cell<T, any>
    ) => ReactElement;
    getAction?: (row: Row<T>) => ReactElement;
    getRowStyling?: (row: Row<T>) => RowStylingEnum | undefined;
    isLoading: boolean;
}

const hooks = [useGroupBy, useExpanded];

export function GroupTable<T extends Record<string, unknown>>(
    props: PropsWithChildren<TableProperties<T>>
): ReactElement {
    const {
        columns,
        tableKey,
        defaultGroupBy,
        children,
        toRenderInCustomCell,
        getCustomCell,
        getAction,
        getRowStyling
    } = props;
    const classes = useTableStyles();

    /**Get saved table settings */
    const [initialState, setInitialState] = useLocalStorage(tableKey, {
        groupBy: defaultGroupBy
    });

    /**Table instance */
    const instance = useTable<T>(
        {
            ...props,
            columns,
            initialState
        },
        ...hooks
    );
    const {
        getTableProps,
        headerGroups,
        getTableBodyProps,
        rows,
        prepareRow,
        state,
        visibleColumns
    } = instance;

    /**Save table settings */
    const debouncedState = useDebounce<TableState>(state, 500);

    useEffect(() => {
        const { groupBy, expanded, hiddenColumns } = debouncedState;
        const val = {
            groupBy,
            expanded,
            hiddenColumns
        };
        setInitialState(val);
    }, [setInitialState, debouncedState]);

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
            (row) => row.index === rowIndex && !row.isGrouped
        );
        if (filteredRows.length) {
            // Should only be one result
            return filteredRows[0];
        }
        return null;
    }

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<Row<any>[]>([]);

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
            const selectIndex = selectedRowIds.indexOf(row.id);
            const isSelected = selectIndex > -1;

            let updatedSelectedRowIds = [...selectedRowIds];
            let updatedSelectedRows = [...selectedRows];

            if (event.ctrlKey || event.metaKey) {
                // 1. Click + CMD/CTRL - select multiple rows

                if (isSelected) {
                    updatedSelectedRowIds.splice(selectIndex, 1);
                    updatedSelectedRows.splice(selectIndex, 1);
                } else {
                    updatedSelectedRowIds.push(row.id);
                    updatedSelectedRows.push(row);
                }
            } else if (event.shiftKey) {
                // 2. Click + SHIFT - Range Select multiple rows

                if (selectedRows.length) {
                    const lastSelectedRow = selectedRows[0];
                    // Calculate array indexes and reset selected rows
                    const lastIndex = rows.indexOf(lastSelectedRow);
                    const currentIndex = rows.indexOf(row);
                    updatedSelectedRowIds = [];
                    updatedSelectedRows = [];
                    if (lastIndex < currentIndex) {
                        for (let i = lastIndex; i <= currentIndex; i++) {
                            const selectedRow = rows[i];
                            if (!selectedRow.isGrouped) {
                                updatedSelectedRowIds.push(selectedRow.id);
                                updatedSelectedRows.push(selectedRow);
                            }
                        }
                    } else {
                        for (let i = currentIndex; i <= lastIndex; i++) {
                            const selectedRow = rows[i];
                            if (!selectedRow.isGrouped) {
                                updatedSelectedRowIds.push(selectedRow.id);
                                updatedSelectedRows.push(selectedRow);
                            }
                        }
                    }
                } else {
                    // No rows previously selected, select only current row
                    updatedSelectedRowIds = [row.id];
                    updatedSelectedRows = [row];
                }
            } else {
                // 3. Single Click - Select only one row

                if (isSelected && updatedSelectedRows.length === 1) {
                    updatedSelectedRowIds = [];
                    updatedSelectedRows = [];
                } else {
                    updatedSelectedRowIds = [row.id];
                    updatedSelectedRows = [row];
                }
            }

            setSelectedRowIds(updatedSelectedRowIds);
            setSelectedRows(updatedSelectedRows);
        },
        [selectedRowIds, selectedRows, rows]
    );

    return (
        <>
            <TableContainer component={Paper} className={classes.root}>
                <div className={classes.tools}>
                    <div className={classes.pasteTool}>{children}</div>
                    <ColumnSelectRT instance={instance} />
                </div>
                <Table
                    role="grid"
                    size="small"
                    aria-label="sjekkliste"
                    {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    const {
                                        title: groupTitle = '',
                                        ...columnGroupByProps
                                    } = column.getGroupByToggleProps();

                                    return (
                                        <TableCell {...column.getHeaderProps()}>
                                            {column.canGroupBy && (
                                                <Tooltip title={groupTitle}>
                                                    <TableSortLabel
                                                        active
                                                        direction={
                                                            column.isGrouped
                                                                ? 'desc'
                                                                : 'asc'
                                                        }
                                                        IconComponent={
                                                            KeyboardArrowRight
                                                        }
                                                        {...columnGroupByProps}
                                                    />
                                                </Tooltip>
                                            )}

                                            {column.render('Header')}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody
                        {...getTableBodyProps()}
                        onClick={(event) => {
                            const row = getRowFromEvent(
                                event.target as HTMLElement,
                                rows
                            );

                            if (row) {
                                handleRowSelection(event, row);
                            }
                        }}>
                        {props.isLoading && (
                            <tr>
                                <td colSpan={visibleColumns.length}>
                                    <LinearProgress sx={{ width: '100%' }} />
                                </td>
                            </tr>
                        )}
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow
                                    data-row-index={row.index}
                                    data-row-is-group-row={
                                        row.isGrouped ? 1 : undefined
                                    }
                                    {...row.getRowProps()}
                                    style={{
                                        cursor: !row.isGrouped
                                            ? 'pointer'
                                            : 'auto'
                                    }}
                                    className={`${getRowClassName(row)} ${
                                        !row.isGrouped && 'slk-table-selectable'
                                    } ${
                                        selectedRowIds.indexOf(row.id) > -1 &&
                                        'slk-table-selected'
                                    }`}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell
                                                data-is-action={
                                                    cell.column.id === 'action'
                                                        ? 1
                                                        : undefined
                                                }
                                                {...cell.getCellProps()}
                                                aria-describedby="rowActionDescription">
                                                {cell.isGrouped ? (
                                                    // If it's a grouped cell, add an expander and row count
                                                    <>
                                                        <Button
                                                            {...row.getToggleRowExpandedProps()}
                                                            variant="text"
                                                            size="small"
                                                            startIcon={
                                                                row.isExpanded ? (
                                                                    <UnfoldLessIcon />
                                                                ) : (
                                                                    <UnfoldMoreIcon />
                                                                )
                                                            }>
                                                            {cell.render(
                                                                'Cell'
                                                            )}{' '}
                                                            (
                                                            {row.subRows.length}
                                                            )
                                                        </Button>
                                                    </>
                                                ) : cell.row.isGrouped ? (
                                                    <span></span>
                                                ) : toRenderInCustomCell.includes(
                                                      cell.column.id
                                                  ) ? (
                                                    getCustomCell ? (
                                                        getCustomCell(
                                                            cell.column.id,
                                                            row,
                                                            cell
                                                        )
                                                    ) : null
                                                ) : cell.column.id ===
                                                  'action' ? (
                                                    getAction ? (
                                                        getAction(row)
                                                    ) : null
                                                ) : instance.state.groupBy.includes(
                                                      cell.column.id
                                                  ) ? null : (
                                                    cell.render('Cell')
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
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
