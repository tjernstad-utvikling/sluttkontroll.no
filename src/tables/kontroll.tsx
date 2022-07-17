import { Cell, ColumnDef, Row } from '@tanstack/react-table';
import { Klient, Kontroll, Skjema } from '../contracts/kontrollApi';

import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Attachment } from '../contracts/attachmentApi';
import { Avvik } from '../contracts/avvikApi';
import DescriptionIcon from '@mui/icons-material/Description';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditIcon from '@mui/icons-material/Edit';
import { GroupTable } from './base/groupTable';
import IconButton from '@mui/material/IconButton';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { Link } from 'react-router-dom';
import { Measurement } from '../contracts/measurementApi';
import { PasteTableButton } from '../components/clipboard';
import { RowAction } from './base/tableUtils';
import { RowStylingEnum } from './base/defaultTable';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { TableKey } from '../contracts/keys';
import { User } from '../contracts/userApi';
import { useClipBoard } from '../data/clipboard';
import { useMemo } from 'react';

type KontrollColumns = {
    id: number;
    klient: string;
    name: string;
    location: string;
    avvik: { open: number; closed: number };
    measurement: number;
    attachments: number;
    instrumenter: number;
    user: string;
    kommentar: string;
    done: boolean;
};

export const KontrollValueGetter = (data: Kontroll | null) => {
    const klient = (klienter: Klient[]): string => {
        if (klienter !== undefined) {
            const klient = klienter.find(
                (k) => k.id === data?.location.klient.id
            );

            return klient?.name || '';
        }
        return '';
    };
    const location = (klienter: Klient[]): string => {
        if (klienter !== undefined) {
            const klient = klienter.find(
                (k) => k.id === data?.location.klient.id
            );
            if (klient !== undefined) {
                const location = klient.locations.find(
                    (o) => o.id === data?.location.id
                );
                return location?.name || '';
            }

            return '';
        }
        return '';
    };
    const user = (users: User[]): string => {
        if (users !== undefined) {
            const user = users.find((u) => u.id === data?.user.id);

            return user?.name || '';
        }
        return '';
    };
    const avvik = (avvik: Avvik[]): { open: number; closed: number } => {
        if (avvik !== undefined) {
            const avvikene = avvik.filter(
                (a) => a.checklist.skjema.kontroll.id === data?.id
            );

            return {
                open: avvikene.filter((a) => a.status !== 'lukket').length,
                closed: avvikene.filter((a) => a.status === 'lukket').length
            };
        }
        return { open: 0, closed: 0 };
    };
    const measurement = (measurements: Measurement[]): number => {
        if (measurements !== undefined) {
            const filteredMeasurements = measurements.filter(
                (m) => m.skjema.kontroll.id === data?.id
            );

            return filteredMeasurements.length;
        }

        return 0;
    };

    const attachment = (attachments: Attachment[]): number => {
        if (attachments !== undefined) {
            const filteredAttachments = attachments.filter(
                (m) => m.kontroll.id === data?.id
            );

            return filteredAttachments.length;
        }

        return 0;
    };

    return { klient, location, user, avvik, measurement, attachment };
};

interface RenderAvvikCellProps {
    klienter: Klient[];
    row: Row<KontrollColumns>;
}
function RenderAvvikCell({ klienter, row }: RenderAvvikCellProps) {
    const klient = useMemo(() => {
        return klienter.find((k) => k.name === row.getValue('klient'));
    }, [klienter, row]);

    const location = useMemo(() => {
        return klient?.locations.find(
            (l) => l.name === row.getValue('location')
        );
    }, [klient?.locations, row]);

    return (
        <Link
            to={`/kontroll/kl/${klient?.id}/obj/${location?.id}/${row.getValue(
                'id'
            )}/avvik`}>
            <span>
                {row.getValue<{ open: number; closed: number }>('avvik').open}{' '}
                <sup>
                    {
                        row.getValue<{ open: number; closed: number }>('avvik')
                            .closed
                    }
                </sup>{' '}
            </span>
        </Link>
    );
}

interface RenderMeasurementCellProps {
    klienter: Klient[];
    row: Row<KontrollColumns>;
    cell: Cell<KontrollColumns, unknown>;
}
function RenderMeasurementCell({
    klienter,
    row,
    cell
}: RenderMeasurementCellProps) {
    const klient = useMemo(() => {
        return klienter.find((k) => k.name === row.getValue('klient'));
    }, [klienter, row]);

    const location = useMemo(() => {
        return klient?.locations.find(
            (l) => l.name === row.getValue('location')
        );
    }, [klient?.locations, row]);

    return (
        <Link
            to={`/kontroll/kl/${klient?.id}/obj/${location?.id}/${row.getValue(
                'id'
            )}/measurement`}>
            {cell.getValue()}
        </Link>
    );
}

interface RenderAttachmentCellProps {
    klienter: Klient[];
    row: Row<KontrollColumns>;
    cell: Cell<KontrollColumns, unknown>;
}
function RenderAttachmentCell({
    klienter,
    row,
    cell
}: RenderAttachmentCellProps) {
    const klient = useMemo(() => {
        return klienter.find((k) => k.name === row.getValue('klient'));
    }, [klienter, row]);

    const location = useMemo(() => {
        return klient?.locations.find(
            (l) => l.name === row.getValue('location')
        );
    }, [klient?.locations, row]);

    return (
        <Link
            to={`/kontroll/kl/${klient?.id}/obj/${location?.id}/${row.getValue(
                'id'
            )}/attachments`}>
            {cell.getValue()}
        </Link>
    );
}

interface RenderInstrumentCellProps {
    klienter: Klient[];
    row: Row<KontrollColumns>;
    cell: Cell<KontrollColumns, unknown>;
}
function RenderInstrumentCell({
    klienter,
    row,
    cell
}: RenderInstrumentCellProps) {
    const klient = useMemo(() => {
        return klienter.find((k) => k.name === row.getValue('klient'));
    }, [klienter, row]);

    const location = useMemo(() => {
        return klient?.locations.find(
            (l) => l.name === row.getValue('location')
        );
    }, [klient?.locations, row]);

    return (
        <>
            <Link
                to={`/kontroll/kl/${klient?.id}/obj/${
                    location?.id
                }/${row.getValue('id')}/instrument`}>
                {cell.getValue()}
            </Link>
            <IconButton
                // to={`${url}/checklist/${id}/avvik/new`}
                // component={RouterLink}
                aria-label="Legg til instrument"
                size="small">
                <AddIcon fontSize="small" />
            </IconButton>
        </>
    );
}

interface RenderActionCellProps {
    klienter: Klient[];
    row: Row<KontrollColumns>;
    edit: (id: number) => void;
    toggleStatus: (id: number) => void;
    clipboardHasSkjema: boolean;
    skjemaToPast: Skjema[];
    editComment: (id: number) => void;
    addAttachment: (id: number) => void;
}
function RenderActionCell({
    klienter,
    row,
    addAttachment,
    clipboardHasSkjema,
    edit,
    editComment,
    skjemaToPast,
    toggleStatus
}: RenderActionCellProps) {
    const klient = useMemo(() => {
        return klienter.find((k) => k.name === row.getValue('klient'));
    }, [klienter, row]);

    const location = useMemo(() => {
        return klient?.locations.find(
            (l) => l.name === row.getValue('location')
        );
    }, [klient?.locations, row]);

    return (
        <>
            {clipboardHasSkjema && (
                <PasteTableButton
                    clipboardHas={true}
                    options={{
                        skjemaPaste: {
                            kontrollId: row.getValue('id'),
                            skjema: skjemaToPast
                        }
                    }}
                />
            )}
            <RowAction
                actionItems={[
                    {
                        name: 'Kommentar',
                        action: () => editComment(row.getValue('id')),
                        skip: row.getValue('done'),
                        icon: <InsertCommentIcon />
                    },
                    {
                        name: 'Rediger',
                        action: () => edit(row.getValue('id')),
                        skip: row.getValue('done'),
                        icon: <EditIcon />
                    },
                    {
                        name: row.getValue('done') ? 'Åpne' : 'Sett som utført',
                        action: () => toggleStatus(row.getValue('id')),
                        icon: <DoneOutlineIcon />
                    },
                    {
                        name: 'Kontrollrapport',
                        to: `/kontroll/kl/${klient?.id}/obj/${
                            location?.id
                        }/${row.getValue('id')}/report`,
                        icon: <DescriptionIcon />
                    },
                    {
                        name: 'Kontrollerklæring',
                        to: `/kontroll/kl/${klient?.id}/obj/${
                            location?.id
                        }/${row.getValue('id')}/report-statement`,
                        icon: <SummarizeIcon />
                    },
                    {
                        name: 'Vedlegg',
                        action: () => addAttachment(row.getValue('id')),
                        icon: <AttachFileIcon />
                    }
                ]}
            />
        </>
    );
}

interface KontrollTableProps {
    kontroller: Kontroll[];
    klienter: Klient[];
    attachments: Attachment[];
    measurements: Measurement[];
    avvik: Avvik[];
    users: User[];
    onSelected: (ids: number[]) => void;
    leftAction?: React.ReactNode;
    loading?: boolean;
    edit: (id: number) => void;
    toggleStatus: (id: number) => void;
    clipboardHasSkjema: boolean;
    skjemaToPast: Skjema[];
    editComment: (id: number) => void;
    addAttachment: (id: number) => void;
}

export const KontrollTable = ({
    kontroller,
    klienter,
    attachments,
    measurements,
    users,
    avvik,
    onSelected,
    leftAction,
    loading,
    addAttachment,
    clipboardHasSkjema,
    edit,
    editComment,
    skjemaToPast,
    toggleStatus
}: KontrollTableProps) => {
    const {
        state: { kontrollClipboard }
    } = useClipBoard();

    const data = useMemo((): KontrollColumns[] => {
        return kontroller.map((k) => {
            return {
                ...k,
                klient: KontrollValueGetter(k).klient(klienter),
                location: KontrollValueGetter(k).location(klienter),
                attachments: KontrollValueGetter(k).attachment(attachments),
                avvik: KontrollValueGetter(k).avvik(avvik),
                measurement: KontrollValueGetter(k).measurement(measurements),
                instrumenter: k.instrumenter.length,
                user: KontrollValueGetter(k).user(users)
            };
        });
    }, [attachments, avvik, klienter, kontroller, measurements, users]);

    const columns: ColumnDef<KontrollColumns>[] = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'id',
                enableGrouping: false,
                aggregatedCell: () => ''
            },
            {
                header: 'Kunde',
                accessorKey: 'klient',
                enableGrouping: true
            },
            {
                header: 'Lokasjon',
                accessorKey: 'location',
                enableGrouping: true
            },
            {
                header: 'Kontroll',
                accessorKey: 'name',
                enableGrouping: true
            },
            {
                header: () => (
                    <span>
                        Avvik åpne <sup>lukket</sup>
                    </span>
                ),
                accessorKey: 'avvik',
                aggregatedCell: () => '',
                enableGrouping: false,
                enableColumnFilter: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <RenderAvvikCell klienter={klienter} row={row} />
                )
            },
            {
                header: 'Målinger',
                accessorKey: 'measurement',
                enableGrouping: false,
                cell: ({ row, cell }) => (
                    <RenderMeasurementCell
                        cell={cell}
                        klienter={klienter}
                        row={row}
                    />
                )
            },
            {
                header: 'Vedlegg',
                accessorKey: 'attachments',
                enableGrouping: false,
                cell: ({ row, cell }) => (
                    <RenderAttachmentCell
                        cell={cell}
                        klienter={klienter}
                        row={row}
                    />
                )
            },
            {
                header: 'Instrumenter',
                accessorKey: 'instrumenter',
                enableGrouping: false,
                cell: ({ row, cell }) => (
                    <RenderInstrumentCell
                        cell={cell}
                        klienter={klienter}
                        row={row}
                    />
                )
            },
            {
                header: 'Utførende',
                accessorKey: 'user',
                enableGrouping: true
            },
            {
                header: 'Kommentar',
                accessorKey: 'kommentar',
                enableGrouping: false
            },
            {
                header: 'Status',
                accessorKey: 'done',
                enableGrouping: true,
                cell: ({ cell }) => {
                    if (cell.getValue()) {
                        return 'Utført';
                    }
                    return 'Pågår';
                }
            },
            {
                header: '',
                accessorKey: 'actions',
                enableGrouping: false,
                enableColumnFilter: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <RenderActionCell
                        addAttachment={addAttachment}
                        clipboardHasSkjema={clipboardHasSkjema}
                        edit={edit}
                        editComment={editComment}
                        klienter={klienter}
                        row={row}
                        skjemaToPast={skjemaToPast}
                        toggleStatus={toggleStatus}
                    />
                )
            }
        ],
        [
            addAttachment,
            clipboardHasSkjema,
            edit,
            editComment,
            klienter,
            skjemaToPast,
            toggleStatus
        ]
    );

    const getRowStyling = (
        row: Row<KontrollColumns>
    ): RowStylingEnum | undefined => {
        if (kontrollClipboard?.find((kc) => kc.id === row.getValue('id'))) {
            return RowStylingEnum.cut;
        }
        if (row.getValue('done')) {
            return RowStylingEnum.completed;
        }
    };

    return (
        <GroupTable<KontrollColumns>
            tableKey={TableKey.kontroll}
            columns={columns}
            data={data}
            defaultGrouping={[]}
            defaultVisibilityState={{}}
            getRowStyling={getRowStyling}
            isLoading={!!loading}>
            {leftAction}
        </GroupTable>
    );
};
