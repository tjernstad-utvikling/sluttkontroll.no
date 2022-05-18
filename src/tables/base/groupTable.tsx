import {
    Cell,
    Row,
    TableOptions,
    TableState,
    useExpanded,
    useGroupBy,
    useTable
} from 'react-table';
import { PropsWithChildren, ReactElement, useEffect } from 'react';

import Button from '@mui/material/Button';
import { ColumnSelectRT } from './tableUtils';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
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
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTableStyles } from './defaultTable';

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
        getAction
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
        state
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

    return (
        <TableContainer component={Paper}>
            <div className={classes.tools}>
                <div className={classes.pasteTool}>{children}</div>
                <ColumnSelectRT instance={instance} />
            </div>
            <Table size="small" aria-label="sjekkliste" {...getTableProps()}>
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
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
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
                                                        {cell.render('Cell')} (
                                                        {row.subRows.length})
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
                                            ) : cell.column.id === 'action' ? (
                                                getAction ? (
                                                    getAction(row)
                                                ) : null
                                            ) : (
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
    );
}