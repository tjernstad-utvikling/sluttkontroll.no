import { Cell, Row, TableState } from 'react-table';

import Button from '@mui/material/Button';
import { ReactElement } from 'react';
import TableCellMui from '@mui/material/TableCell';
import TableRowMui from '@mui/material/TableRow';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface TableRowProps<T extends {}> {
    row: Row<T>;
    state: TableState<T>;
    isSelected: boolean;
    rowClassName: string;
    getAction?: (row: Row<T>) => ReactElement;
    toRenderInCustomCell: string[];
    getCustomCell?: (
        accessor: string,
        row: Row<T>,
        cell: Cell<T, any>
    ) => ReactElement;
}
export function TableRow<T extends {}>({
    row,
    state,
    rowClassName,
    isSelected,
    getAction,
    toRenderInCustomCell,
    getCustomCell
}: TableRowProps<T>) {
    return (
        <TableRowMui
            data-row-index={row.index}
            data-row-is-group-row={row.isGrouped ? 1 : undefined}
            {...row.getRowProps()}
            style={{
                cursor: !row.isGrouped ? 'pointer' : 'auto'
            }}
            className={`${rowClassName} ${
                !row.isGrouped && 'slk-table-selectable'
            } ${isSelected && 'Mui-selected'}`}>
            {row.cells.map((cell) => {
                return (
                    <TableCell
                        toRenderInCustomCell={toRenderInCustomCell}
                        getCustomCell={getCustomCell}
                        cell={cell}
                        state={state}
                        getAction={getAction}
                    />
                );
            })}
        </TableRowMui>
    );
}

interface TableCellProps<T extends {}> {
    cell: Cell<T, any>;
    state: TableState<T>;
    getAction?: (row: Row<T>) => ReactElement;
    toRenderInCustomCell: string[];
    getCustomCell?: (
        accessor: string,
        row: Row<T>,
        cell: Cell<T, any>
    ) => ReactElement;
}
export function TableCell<T extends {}>({
    cell,
    state,
    getAction,
    toRenderInCustomCell,
    getCustomCell
}: TableCellProps<T>) {
    if (cell.column.id === 'action')
        return (
            <TableCellMui data-is-action={1} {...cell.getCellProps()}>
                {cell.row.isGrouped ? (
                    <span></span>
                ) : getAction ? (
                    getAction(cell.row)
                ) : null}
            </TableCellMui>
        );
    if (cell.isGrouped || cell.row.isGrouped)
        return (
            <TableCellMui
                data-is-action={cell.column.id === 'action' ? 1 : undefined}
                {...cell.getCellProps()}
                aria-describedby="rowActionDescription">
                {cell.isGrouped ? (
                    // If it's a grouped cell, add an expander and row count
                    <>
                        <Button
                            {...cell.row.getToggleRowExpandedProps()}
                            variant="text"
                            size="small"
                            startIcon={
                                cell.row.isExpanded ? (
                                    <UnfoldLessIcon />
                                ) : (
                                    <UnfoldMoreIcon />
                                )
                            }>
                            {cell.render('Cell')} ({cell.row.subRows.length})
                        </Button>
                    </>
                ) : cell.row.isGrouped ? (
                    <span></span>
                ) : null}
            </TableCellMui>
        );

    return (
        <TableCellMui
            {...cell.getCellProps()}
            aria-describedby="rowActionDescription">
            {toRenderInCustomCell.includes(cell.column.id)
                ? getCustomCell
                    ? getCustomCell(cell.column.id, cell.row, cell)
                    : null
                : state.groupBy.includes(cell.column.id)
                ? null
                : cell.render('Cell')}
        </TableCellMui>
    );
}
