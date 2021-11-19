import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';
import { Klient, Kontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
import { BaseTable } from './baseTable';
import DescriptionIcon from '@mui/icons-material/Description';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { Measurement } from '../contracts/measurementApi';
import { PasteTableButton } from '../components/clipboard';
import { RowAction } from '../tables/tableUtils';
import { User } from '../contracts/userApi';

export const KontrollValueGetter = (data: Kontroll | GridRowModel) => {
    const klient = (klienter: Klient[]): string => {
        if (klienter !== undefined) {
            const klient = klienter.find(
                (k) => k.id === data.location.klient.id
            );

            return klient?.name || '';
        }
        return '';
    };
    const objekt = (klienter: Klient[]): string => {
        if (klienter !== undefined) {
            const klient = klienter.find(
                (k) => k.id === data.location.klient.id
            );
            if (klient !== undefined) {
                const location = klient.locations.find(
                    (o) => o.id === data.location.id
                );
                return location?.name || '';
            }

            return '';
        }
        return '';
    };
    const user = (users: User[]): string => {
        if (users !== undefined) {
            const user = users.find((u) => u.id === data.user.id);

            return user?.name || '';
        }
        return '';
    };
    const avvik = (avvik: Avvik[]): { open: number; closed: number } => {
        if (avvik !== undefined) {
            const avvikene = avvik.filter(
                (a) => a.checklist.skjema.kontroll.id === data.id
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
                (m) => m.skjema.kontroll.id === data.id
            );

            return filteredMeasurements.length;
        }

        return 0;
    };

    return { klient, objekt, user, avvik, measurement };
};
export const kontrollColumns = (
    users: User[],
    klienter: Klient[],
    avvik: Avvik[],
    measurements: Measurement[],
    edit: (id: number) => void,
    toggleStatus: (id: number) => void,
    clipboardHasSkjema: boolean,
    skjemaToPast: Skjema[]
) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'klient',
            headerName: 'Klient',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                KontrollValueGetter(params.row).klient(klienter),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    KontrollValueGetter(param1.api.getRow(param1.id)).klient(
                        klienter
                    )
                ).localeCompare(
                    String(
                        KontrollValueGetter(
                            param2.api.getRow(param2.id)
                        ).klient(klienter)
                    )
                )
        },
        {
            field: 'objekt',
            headerName: 'Lokasjon',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                KontrollValueGetter(params.row).objekt(klienter),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    KontrollValueGetter(param1.api.getRow(param1.id)).objekt(
                        klienter
                    )
                ).localeCompare(
                    String(
                        KontrollValueGetter(
                            param2.api.getRow(param2.id)
                        ).objekt(klienter)
                    )
                )
        },
        {
            field: 'name',
            headerName: 'Kontroll',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link
                    to={`/kontroll/kl/${params.row.location.klient.id}/obj/${params.row.location.id}/${params.row.id}`}>
                    {params.row.name}
                </Link>
            )
        },
        {
            field: 'avvik',
            headerName: 'Avvik (åpne | lukket) ',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link
                    to={`/kontroll/kl/${params.row.location.klient.id}/obj/${params.row.location.id}/${params.row.id}/avvik`}>
                    <span>
                        ({KontrollValueGetter(params.row).avvik(avvik).open} |{' '}
                        {KontrollValueGetter(params.row).avvik(avvik).closed} ){' '}
                    </span>
                </Link>
            ),
            sortComparator: (v1, v2, param1, param2) =>
                KontrollValueGetter(param1.api.getRow(param1.id)).avvik(avvik)
                    .open -
                KontrollValueGetter(param2.api.getRow(param2.id)).avvik(avvik)
                    .open
        },
        {
            field: 'measurement',
            headerName: 'Målinger',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link
                    to={`/kontroll/kl/${params.row.location.klient.id}/obj/${params.row.location.id}/${params.row.id}/measurement`}>
                    {KontrollValueGetter(params.row).measurement(measurements)}
                </Link>
            ),
            sortComparator: (v1, v2, param1, param2) =>
                KontrollValueGetter(param1.api.getRow(param1.id)).measurement(
                    measurements
                ) -
                KontrollValueGetter(param2.api.getRow(param2.id)).measurement(
                    measurements
                )
        },
        {
            field: 'user',
            headerName: 'Utførende',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                KontrollValueGetter(params.row).user(users),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    KontrollValueGetter(param1.api.getRow(param1.id)).user(
                        users
                    )
                ).localeCompare(
                    String(
                        KontrollValueGetter(param2.api.getRow(param2.id)).user(
                            users
                        )
                    )
                )
        },
        {
            field: 'kommentar',
            headerName: 'Kommentar',
            flex: 1
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <>
                    {clipboardHasSkjema && (
                        <PasteTableButton
                            clipboardHas={true}
                            options={{
                                skjemaPaste: {
                                    kontrollId: params.row.id,
                                    skjema: skjemaToPast
                                }
                            }}
                        />
                    )}
                    <RowAction
                        actionItems={[
                            {
                                name: 'Rediger',
                                action: () => edit(params.row.id),
                                skip: params.row.done,
                                icon: <EditIcon />
                            },
                            {
                                name: params.row.done
                                    ? 'Åpne'
                                    : 'Sett som utført',
                                action: () => toggleStatus(params.row.id),
                                icon: <DoneOutlineIcon />
                            },
                            {
                                name: 'Kontrollrapport',
                                to: `/kontroll/kl/${params.row.location.klient.id}/obj/${params.row.location.id}/${params.row.id}/report`,
                                icon: <DescriptionIcon />
                            }
                        ]}
                    />
                </>
            )
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = [
    'klient',
    'objekt',
    'name',
    'user'
];

interface KontrollTableProps {
    kontroller: Array<Kontroll>;
}
export const KontrollTable = ({ kontroller }: KontrollTableProps) => {
    return <BaseTable data={kontroller} />;
};
