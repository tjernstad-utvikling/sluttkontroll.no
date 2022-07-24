import { Header, Table, flexRender } from '@tanstack/react-table';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { ColumnAction } from '../tableUtils';
import { FilterRemove } from './filter';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useTableStyles } from '../style';

interface HeaderCellProps<T extends {}> {
    header: Header<T, unknown>;
    table: Table<T>;
}

export function HeaderCell<T extends {}>({
    header,
    table
}: HeaderCellProps<T>) {
    const { classes } = useTableStyles();
    return (
        <TableCell
            className={classes.header}
            key={header.id}
            colSpan={header.colSpan}>
            {header.isPlaceholder ? null : (
                <>
                    <div
                        className={classes.header}
                        style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                        {header.column.getCanGroup() ? (
                            <Tooltip title={'Grupper kolonne'}>
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
                                    IconComponent={KeyboardArrowRight}
                                />
                            </Tooltip>
                        ) : null}{' '}
                        <Tooltip title={'Sorter kolonne'}>
                            <div
                                {...{
                                    className: header.column.getCanSort()
                                        ? classes.canSortClass
                                        : '',
                                    onClick:
                                        header.column.getToggleSortingHandler()
                                }}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </div>
                        </Tooltip>{' '}
                        {{
                            asc: <ArrowDropUpIcon />,
                            desc: <ArrowDropDownIcon />
                        }[header.column.getIsSorted() as string] ?? null}
                        <FilterRemove column={header.column} table={table} />
                        <div
                            style={{
                                flexGrow: 3
                            }}
                        />
                        {(header.column.getCanFilter() ||
                            header.column.getCanSort()) && (
                            <ColumnAction
                                column={header.column}
                                table={table}
                            />
                        )}
                    </div>
                </>
            )}
        </TableCell>
    );
}
