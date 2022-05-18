import { Cell, Column, Row } from 'react-table';

import AddIcon from '@mui/icons-material/Add';
import { Avvik } from '../contracts/avvikApi';
import { Checklist } from '../contracts/kontrollApi';
import { GroupTable } from './base/groupTable';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { PasteTableButton } from '../components/clipboard';
import { Link as RouterLink } from 'react-router-dom';
import { RowAction } from './base/tableUtils';
import { TableKey } from '../contracts/keys';
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

type ChecklistColumns = {
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
    const data = useMemo((): ChecklistColumns[] => {
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

    const columns: Column<ChecklistColumns>[] = useMemo(
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
    const getAction = (row: Row<ChecklistColumns>) => (
        <>
            {clipboardHasAvvik && (
                <PasteTableButton
                    clipboardHas={true}
                    options={{
                        avvikPaste: {
                            checklistId: Number(
                                row.cells.find((c) => c.column.id === 'id')
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
                        name: row.values.aktuell
                            ? 'sett: Ikke aktuell'
                            : 'sett: aktuell',
                        action: () =>
                            toggleAktuell(
                                Number(
                                    row.allCells.find(
                                        (c) => c.column.id === 'id'
                                    )?.value
                                )
                            ),
                        // skip: kontroll?.done || false,
                        icon: row.values.aktuell ? (
                            <VisibilityOffIcon />
                        ) : (
                            <VisibilityIcon />
                        )
                    }
                ]}
            />
        </>
    );

    const getCustomCell = (
        accessor: string,
        row: Row<ChecklistColumns>,
        cell: Cell<ChecklistColumns, any>
    ) => {
        console.log(row);
        switch (accessor) {
            case 'avvik':
                return (
                    <AvvikCell
                        avvik={cell.value}
                        id={
                            row.allCells.find((c) => c.column.id === 'id')
                                ?.value
                        }
                        url={url}
                    />
                );
            case 'aktuell':
                return <AktuellCell aktuell={cell.value} />;

            default:
                return <span />;
        }
    };

    return (
        <GroupTable<ChecklistColumns>
            tableKey={TableKey.checklist}
            columns={columns}
            data={data}
            defaultGroupBy={['gruppe']}
            toRenderInCustomCell={['avvik', 'aktuell']}
            getCustomCell={getCustomCell}
            getAction={getAction}
        />
    );
};
