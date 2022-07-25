import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MenuItem from '@mui/material/MenuItem';
import { Table } from '@tanstack/react-table';
import TextField from '@mui/material/TextField';

interface PaginationProps<T extends {}> {
    table: Table<T>;
}
export function Pagination<T extends {}>({ table }: PaginationProps<T>) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '10px'
                }}>
                <IconButton
                    color="primary"
                    aria-label="Gå til første side"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}>
                    <KeyboardDoubleArrowLeftIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    aria-label="Gå tilbake en"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    aria-label="Gå fram en"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    <KeyboardArrowRightIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    aria-label="Gå til siste side"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}>
                    <KeyboardDoubleArrowRightIcon />
                </IconButton>
                <span style={{ paddingLeft: '20px' }}>
                    <TextField
                        size="small"
                        label={'Gå til side'}
                        id="outlined-basic"
                        variant="outlined"
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                    />
                </span>
            </div>

            <TextField
                size="small"
                select
                label="Antall elementer"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                }}>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                    <MenuItem key={pageSize} value={pageSize}>
                        {pageSize}
                    </MenuItem>
                ))}
            </TextField>
            <span>
                <div>Side</div>
                <strong>
                    {table.getState().pagination.pageIndex + 1} av{' '}
                    {table.getPageCount()}
                </strong>
            </span>
        </div>
    );
}
