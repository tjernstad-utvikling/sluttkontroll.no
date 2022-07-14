import { Cell, Row, TableState, flexRender } from '@tanstack/react-table';

import Button from '@mui/material/Button';
import { ReactElement } from 'react';
import TableCellMui from '@mui/material/TableCell';
import TableRowMui from '@mui/material/TableRow';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface TableRowProps<T extends {}> {
    row: Row<T>;
    state: TableState;
    isSelected: boolean;
    rowClassName: string;
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
    toRenderInCustomCell,
    getCustomCell
}: TableRowProps<T>) {
    return (
        <TableRowMui
            data-row-index={row.index}
            data-row-is-group-row={row.getIsGrouped() ? 1 : undefined}
            style={{
                cursor: !row.getIsGrouped() ? 'pointer' : 'auto'
            }}
            className={`${rowClassName} ${
                !row.getIsGrouped() && 'slk-table-selectable'
            } ${isSelected && 'Mui-selected'}`}>
            {row.getVisibleCells().map((cell) => {
                return (
                    <TableCell
                        key={cell.id}
                        toRenderInCustomCell={toRenderInCustomCell}
                        getCustomCell={getCustomCell}
                        cell={cell}
                        state={state}
                    />
                );
            })}
        </TableRowMui>
    );
}

interface TableCellProps<T extends {}> {
    cell: Cell<T, any>;
    state: TableState;
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
    toRenderInCustomCell,
    getCustomCell
}: TableCellProps<T>) {
    if (cell.column.id === 'action')
        return (
            <TableCellMui data-is-action={1}>
                {cell.row.getIsGrouped() ? <span></span> : null}
            </TableCellMui>
        );
    if (cell.getIsGrouped() || cell.row.getIsGrouped())
        return (
            <TableCellMui
                data-is-action={cell.column.id === 'action' ? 1 : undefined}
                aria-describedby="rowActionDescription">
                {cell.getIsGrouped() ? (
                    // If it's a grouped cell, add an expander and row count
                    <>
                        <Button
                            {...{
                                onClick: cell.row.getToggleExpandedHandler(),
                                style: {
                                    cursor: cell.row.getCanExpand()
                                        ? 'pointer'
                                        : 'normal'
                                }
                            }}
                            variant="text"
                            size="small"
                            startIcon={
                                cell.row.getIsExpanded() ? (
                                    <UnfoldLessIcon />
                                ) : (
                                    <UnfoldMoreIcon />
                                )
                            }>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}{' '}
                            ({cell.row.subRows.length})
                        </Button>
                    </>
                ) : cell.row.getIsGrouped() ? (
                    <span></span>
                ) : null}
            </TableCellMui>
        );

    return (
        <TableCellMui aria-describedby="rowActionDescription">
            {
                // toRenderInCustomCell.includes(cell.column.id)
                //     ? getCustomCell
                //         ? getCustomCell(cell.column.id, cell.row, cell)
                //         : null
                //     : state.grouping.includes(cell.column.id)
                //     ? null
                //     :
                flexRender(cell.column.columnDef.cell, cell.getContext())
            }
        </TableCellMui>
    );
}
