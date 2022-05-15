import { Column, useTable } from 'react-table';

import AddIcon from '@mui/icons-material/Add';
import { Avvik } from '../contracts/avvikApi';
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
    return { prosedyre, prosedyreNr, avvik };
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
                action: c.id
            };
        });
    }, [avvik, checklists]);

    const columns: Column<{
        id: number;
        prosedyreNr: string;
        prosedyre: string;
        avvik: any;
        aktuell: boolean;
        action: number;
    }>[] = useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Prosedyre nr',
                accessor: 'prosedyreNr'
            },
            {
                Header: 'Prosedyre',
                accessor: 'prosedyre'
            },
            {
                Header: 'Avvik (åpne | lukket) ',
                accessor: 'avvik'
            },
            {
                Header: 'Aktuell',
                accessor: 'aktuell'
            },
            {
                Header: '',
                accessor: 'action'
            }
        ],
        []
    );

    const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } =
        useTable({
            columns,
            data
        });

    return (
        <TableContainer component={Paper}>
            <Table aria-label="sjekkliste" {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell {...column.getHeaderProps()}>
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
                                            {cell.column.id === 'avvik' ? (
                                                <AvvikCell
                                                    avvik={cell.value}
                                                    id={cell.row.id}
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
                                                                            row.id
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
                                                                            row.id
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
