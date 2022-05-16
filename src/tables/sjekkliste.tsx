import { Column, useExpanded, useGroupBy, useTable } from 'react-table';

import AddIcon from '@mui/icons-material/Add';
import { Avvik } from '../contracts/avvikApi';
import Button from '@mui/material/Button';
import { Checklist } from '../contracts/kontrollApi';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { PasteTableButton } from '../components/clipboard';
import { Link as RouterLink } from 'react-router-dom';
import { RowAction } from './tableUtils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMemo } from 'react';

export const SjekklisteValueGetter = (data: Checklist | null) => {
    const prosedyre = (): string => {
        return data?.checkpoint.prosedyre ?? '';
    };
    const prosedyreNr = (): string => {
        return data?.checkpoint.prosedyreNr ?? '';
    };
    const gruppe = (): string => {
        return data?.checkpoint.gruppe ?? '';
    };
    const avvik = (avvik: Avvik[]): { open: number; closed: number } => {
        if (avvik !== undefined) {
            const avvikene = avvik.filter((a) => a.checklist.id === data?.id);

            return {
                open: avvikene.filter((a) => a.status !== 'lukket').length,
                closed: avvikene.filter((a) => a.status === 'lukket').length
            };
        }
        return { open: 0, closed: 0 };
    };
    return { prosedyre, prosedyreNr, avvik, gruppe };
};
interface AvvikCellProps {
    url: string;
    id: string;
    avvik: { open: number; closed: number };
}
const AvvikCell = ({ avvik, url, id }: AvvikCellProps) => {
    return (
        <>
            <Link to={`${url}/checklist/${id}/avvik`}>
                <span>
                    ( {avvik.open} | {avvik.closed} ){' '}
                </span>
            </Link>
            <IconButton
                to={`${url}/checklist/${id}/avvik/new`}
                component={RouterLink}
                aria-label="nytt avvik"
                size="large">
                <AddIcon />
            </IconButton>
        </>
    );
};

const AktuellCell = ({ aktuell }: { aktuell: boolean }) => {
    if (aktuell) {
        return <VisibilityIcon />;
    }

    return (
        <>
            <VisibilityOffIcon />
            <Typography style={{ paddingLeft: 10 }}>Ikke aktuell</Typography>
        </>
    );
};

type Cols = {
    id: number;
    prosedyreNr: string;
    prosedyre: string;
    avvik: any;
    aktuell: boolean;
    gruppe: string;
    action: number;
};

interface SjekklisteTableProps {
    checklists: Checklist[];
    avvik: Avvik[];
    url: string;
    toggleAktuell: (id: number) => void;
    clipboardHasAvvik: boolean;
    avvikToPast: Avvik[];
}
export const SjekklisteTable = ({
    checklists,
    avvik,
    url,
    avvikToPast,
    clipboardHasAvvik,
    toggleAktuell
}: SjekklisteTableProps) => {
    const data = useMemo((): Cols[] => {
        return checklists.map((c) => {
            return {
                ...c,
                prosedyreNr: c.checkpoint.prosedyreNr,
                prosedyre: c.checkpoint.prosedyre,
                avvik: SjekklisteValueGetter(c).avvik(avvik),
                action: c.id,
                gruppe: c.checkpoint.gruppe
            };
        });
    }, [avvik, checklists]);

    const columns: Column<{
        id: number;
        prosedyreNr: string;
        prosedyre: string;
        avvik: any;
        aktuell: boolean;
        gruppe: string;
        action: number;
    }>[] = useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id',
                canGroupBy: false
            },
            {
                Header: 'Prosedyre nr',
                accessor: 'prosedyreNr',
                canGroupBy: false
            },
            {
                Header: 'Prosedyre',
                accessor: 'prosedyre',
                canGroupBy: false
            },
            {
                Header: 'Avvik (åpne | lukket) ',
                accessor: 'avvik',
                canGroupBy: false
            },
            {
                Header: 'Aktuell',
                accessor: 'aktuell',
                canGroupBy: false
            },
            {
                Header: 'Gruppe',
                accessor: 'gruppe',
                canGroupBy: true
            },
            {
                Header: '',
                accessor: 'action',
                canGroupBy: false
            }
        ],
        []
    );

    const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } =
        useTable<Cols>(
            {
                columns,
                data,
                initialState: {
                    groupBy: ['gruppe']
                }
            },
            useGroupBy,
            useExpanded
        );

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="sjekkliste" {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell {...column.getHeaderProps()}>
                                    {column.canGroupBy
                                        ? // If the column can be grouped, let's add a toggle
                                          // <span
                                          //     {...column.getGroupByToggleProps()}>
                                          //     {column.isGrouped ? '🛑 ' : '👊 '}
                                          // </span>
                                          null
                                        : null}
                                    {column.render('Header')}
                                </TableCell>
                            ))}
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
                                            ) : cell.column.id === 'avvik' ? (
                                                <AvvikCell
                                                    avvik={cell.value}
                                                    id={
                                                        row.cells.find(
                                                            (c) =>
                                                                c.column.id ===
                                                                'id'
                                                        )?.value
                                                    }
                                                    url={url}
                                                />
                                            ) : cell.column.id === 'aktuell' ? (
                                                <AktuellCell
                                                    aktuell={cell.value}
                                                />
                                            ) : cell.column.id === 'action' ? (
                                                <>
                                                    {clipboardHasAvvik && (
                                                        <PasteTableButton
                                                            clipboardHas={true}
                                                            options={{
                                                                avvikPaste: {
                                                                    checklistId:
                                                                        Number(
                                                                            row.cells.find(
                                                                                (
                                                                                    c
                                                                                ) =>
                                                                                    c
                                                                                        .column
                                                                                        .id ===
                                                                                    'id'
                                                                            )
                                                                                ?.value
                                                                        ),
                                                                    avvik: avvikToPast
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    <RowAction
                                                        actionItems={[
                                                            {
                                                                name: row.values
                                                                    .aktuell
                                                                    ? 'sett: Ikke aktuell'
                                                                    : 'sett: aktuell',
                                                                action: () =>
                                                                    toggleAktuell(
                                                                        Number(
                                                                            row.cells.find(
                                                                                (
                                                                                    c
                                                                                ) =>
                                                                                    c
                                                                                        .column
                                                                                        .id ===
                                                                                    'id'
                                                                            )
                                                                                ?.value
                                                                        )
                                                                    ),
                                                                // skip: kontroll?.done || false,
                                                                icon: row.values
                                                                    .aktuell ? (
                                                                    <VisibilityOffIcon />
                                                                ) : (
                                                                    <VisibilityIcon />
                                                                )
                                                            }
                                                        ]}
                                                    />
                                                </>
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
};
