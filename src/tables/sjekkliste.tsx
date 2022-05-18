import {
    Column,
    TableState,
    useExpanded,
    useGroupBy,
    useTable
} from 'react-table';
import { ColumnSelectRT, RowAction } from './base/tableUtils';
import { useEffect, useMemo } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Avvik } from '../contracts/avvikApi';
import Button from '@mui/material/Button';
import { Checklist } from '../contracts/kontrollApi';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { PasteTableButton } from '../components/clipboard';
import { Link as RouterLink } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableKey } from '../contracts/keys';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTableStyles } from './base/baseTable';

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
    children?: React.ReactNode;
}
export const SjekklisteTable = ({
    checklists,
    avvik,
    url,
    avvikToPast,
    clipboardHasAvvik,
    toggleAktuell,
    children
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
                disableGroupBy: true
            },
            {
                Header: 'Prosedyre nr',
                accessor: 'prosedyreNr',
                disableGroupBy: true
            },
            {
                Header: 'Prosedyre',
                accessor: 'prosedyre',
                disableGroupBy: true
            },
            {
                Header: 'Avvik (åpne | lukket) ',
                accessor: 'avvik',
                disableGroupBy: true
            },
            {
                Header: 'Aktuell',
                accessor: 'aktuell',
                disableGroupBy: true
            },
            {
                Header: 'Gruppe',
                accessor: 'gruppe',
                disableGroupBy: false
            },
            {
                Header: '',
                accessor: 'action',
                disableGroupBy: true
            }
        ],
        []
    );

    const [initialState, setInitialState] = useLocalStorage(
        TableKey.checklist,
        { groupBy: ['gruppe'] }
    );

    const instance = useTable<Cols>(
        {
            columns,
            data,
            initialState
        },
        useGroupBy,
        useExpanded
    );

    const {
        getTableProps,
        headerGroups,
        getTableBodyProps,
        rows,
        prepareRow,
        state
    } = instance;

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

    const classes = useTableStyles();
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
