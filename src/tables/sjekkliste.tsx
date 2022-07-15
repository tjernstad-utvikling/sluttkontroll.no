import { ColumnDef, Row } from '@tanstack/react-table';

import AddIcon from '@mui/icons-material/Add';
import { Avvik } from '../contracts/avvikApi';
import { Checklist } from '../contracts/kontrollApi';
import { GroupTable } from './base/groupTable';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { PasteTableButton } from '../components/clipboard';
import { Link as RouterLink } from 'react-router-dom';
import { RowAction } from './base/tableUtils';
import { RowStylingEnum } from './base/defaultTable';
import { TableKey } from '../contracts/keys';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { categories } from '../utils/checkpointCategories.json';
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
    row: Row<ChecklistColumns>;
}
const AvvikCell = ({ avvik, url, id, row }: AvvikCellProps) => {
    return (
        <>
            <Link to={`${url}/checklist/${id}/avvik`}>
                <span>
                    ( {avvik.open} | {avvik.closed} ){' '}
                </span>
            </Link>
            {row.getValue('aktuell') ? (
                <IconButton
                    to={`${url}/checklist/${id}/avvik/new`}
                    component={RouterLink}
                    aria-label="nytt avvik"
                    size="small">
                    <AddIcon fontSize="small" />
                </IconButton>
            ) : (
                <span />
            )}
        </>
    );
};

const AktuellCell = ({ aktuell }: { aktuell: boolean }) => {
    if (aktuell) {
        return <VisibilityIcon fontSize="small" />;
    }

    return (
        <>
            <VisibilityOffIcon fontSize="small" />
            <Typography fontSize={'small'} style={{ paddingLeft: 10 }}>
                Ikke aktuell
            </Typography>
        </>
    );
};

type ChecklistColumns = {
    id: number;
    prosedyreNr: string;
    prosedyre: string;
    avvik: any;
    aktuell: boolean;
    groupCategory: string;
    mainCategory: string;
};

interface SjekklisteTableProps {
    checklists: Checklist[];
    avvik: Avvik[];
    url: string;
    toggleAktuell: (id: number) => void;
    clipboardHasAvvik: boolean;
    avvikToPast: Avvik[];
    children?: React.ReactNode;
    isLoading: boolean;
}
export const SjekklisteTable = ({
    checklists,
    avvik,
    url,
    avvikToPast,
    clipboardHasAvvik,
    toggleAktuell,
    children,
    isLoading
}: SjekklisteTableProps) => {
    const data = useMemo((): ChecklistColumns[] => {
        return checklists.map((c) => {
            return {
                ...c,
                prosedyreNr: c.checkpoint.prosedyreNr,
                prosedyre: c.checkpoint.prosedyre,
                avvik: SjekklisteValueGetter(c).avvik(avvik),
                groupCategory:
                    categories
                        .find((mc) => mc.key === c.checkpoint.mainCategory)
                        ?.groups.find(
                            (g) => g.key === c.checkpoint.groupCategory
                        )?.name ?? String(c.checkpoint.groupCategory),
                mainCategory:
                    categories.find(
                        (mc) => mc.key === c.checkpoint.mainCategory
                    )?.name ?? String(c.checkpoint.groupCategory),
                gruppe: c.checkpoint.gruppe
            };
        });
    }, [avvik, checklists]);

    const columns: ColumnDef<ChecklistColumns>[] = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'id',
                enableGrouping: false
            },
            {
                header: 'Prosedyre nr',
                accessorKey: 'prosedyreNr',
                enableGrouping: false
            },
            {
                header: 'Prosedyre',
                accessorKey: 'prosedyre',
                enableGrouping: false
            },
            {
                header: 'Avvik (åpne | lukket) ',
                accessorKey: 'avvik',
                enableGrouping: false,
                cell: ({ cell, row }) => (
                    <AvvikCell
                        avvik={cell.getValue()}
                        id={row.getValue('id')}
                        url={url}
                        row={row}
                    />
                )
            },
            {
                header: 'Aktuell',
                accessorKey: 'aktuell',
                enableGrouping: false,
                cell: ({ cell }) => <AktuellCell aktuell={cell.getValue()} />
            },
            {
                header: 'Kategori',
                accessorKey: 'mainCategory',
                enableGrouping: true
            },
            {
                header: 'Gruppe',
                accessorKey: 'groupCategory',
                enableGrouping: true
            },
            {
                header: '',
                accessorKey: 'action',
                enableGrouping: false,
                cell: ({ row }) => (
                    <>
                        {clipboardHasAvvik && (
                            <PasteTableButton
                                clipboardHas={true}
                                options={{
                                    avvikPaste: {
                                        checklistId: Number(row.getValue('id')),
                                        avvik: avvikToPast
                                    }
                                }}
                            />
                        )}
                        <RowAction
                            actionItems={[
                                {
                                    name: row.getValue('aktuell')
                                        ? 'sett: Ikke aktuell'
                                        : 'sett: aktuell',
                                    action: () =>
                                        toggleAktuell(
                                            Number(
                                                row
                                                    .getAllCells()
                                                    .find(
                                                        (c) =>
                                                            c.column.id === 'id'
                                                    )
                                                    ?.getValue()
                                            )
                                        ),
                                    // skip: kontroll?.done || false,
                                    icon: row.getValue('aktuell') ? (
                                        <VisibilityOffIcon />
                                    ) : (
                                        <VisibilityIcon />
                                    )
                                }
                            ]}
                        />
                    </>
                )
            }
        ],
        [avvikToPast, clipboardHasAvvik, toggleAktuell, url]
    );

    const getRowStyling = (
        row: Row<ChecklistColumns>
    ): RowStylingEnum | undefined => {
        if (!row.getValue('aktuell') && !row.getIsGrouped()) {
            return RowStylingEnum.disabled;
        }
    };

    return (
        <GroupTable<ChecklistColumns>
            tableKey={TableKey.checklist}
            columns={columns}
            data={data}
            defaultGrouping={['groupCategory']}
            defaultVisibilityState={{}}
            getRowStyling={getRowStyling}
            isLoading={isLoading}
        />
    );
};
