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
import { TableRow } from './components/group';
import TableRowMui from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
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
    setSelected?: (rows: Row<T>[]) => void;
    selectedIds?: number[];
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
        getRowStyling,
        setSelected,
        selectedIds
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

    const [selectedRows, setSelectedRows] = useState<Row<T>[]>([]);

    useEffect(() => {
        if (selectedIds)
            setSelectedRows(
                rows.filter((r) => {
                    if (r.values.hasOwnProperty('id')) {
                        return selectedIds.find((o) => o === r.values.id);
                    }
                    return false;
                })
            );
    }, [rows, selectedIds]);

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

            if (event.ctrlKey || event.metaKey) {
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
                    const lastIndex = rows.indexOf(lastSelectedRow);
                    const currentIndex = rows.indexOf(row);

                    updatedSelectedRows = [];
                    if (lastIndex < currentIndex) {
                        for (let i = lastIndex; i <= currentIndex; i++) {
                            const selectedRow = rows[i];
                            if (!selectedRow.isGrouped) {
                                updatedSelectedRows.push(selectedRow);
                            }
                        }
                    } else {
                        for (let i = currentIndex; i <= lastIndex; i++) {
                            const selectedRow = rows[i];
                            if (!selectedRow.isGrouped) {
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

            setSelectedRows(updatedSelectedRows);
            if (setSelected) setSelected(updatedSelectedRows);
        },
        [selectedRows, setSelected, rows]
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
                            <TableRowMui {...headerGroup.getHeaderGroupProps()}>
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
                            </TableRowMui>
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
                                <TableRow<T>
                                    {...row.getRowProps()}
                                    row={row}
                                    state={state}
                                    isSelected={
                                        !!selectedRows?.find(
                                            (r) => r.id === row.id
                                        )
                                    }
                                    rowClassName={getRowClassName(row)}
                                    getAction={getAction}
                                    toRenderInCustomCell={toRenderInCustomCell}
                                    getCustomCell={getCustomCell}
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
