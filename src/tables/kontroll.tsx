import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { Klient, Kontroll } from '../contracts/kontrollApi';

import { BaseTable } from './baseTable';
import { Link } from 'react-router-dom';
import { RowAction } from '../tables/tableUtils';
import { User } from '../contracts/userApi';

export const KontrollValueGetter = (data: Kontroll | GridRowData) => {
    const klient = (klienter: Klient[]): string => {
        if (klienter !== undefined) {
            const klient = klienter.find((k) => k.id === data.Objekt.klient.id);

            return klient?.name || '';
        }
        return '';
    };
    const objekt = (klienter: Klient[]): string => {
        if (klienter !== undefined) {
            const klient = klienter.find((k) => k.id === data.Objekt.klient.id);
            if (klient !== undefined) {
                const location = klient.objekts.find(
                    (o) => o.id === data.Objekt.id
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

    return { klient, objekt, user };
};
export const kontrollColumns = (
    users: User[],
    klienter: Klient[],
    url: string,
    edit: (id: number) => void
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
                KontrollValueGetter(params.row).klient(klienter)
        },
        {
            field: 'objekt',
            headerName: 'Lokasjon',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                KontrollValueGetter(params.row).objekt(klienter)
        },
        {
            field: 'name',
            headerName: 'Kontroll',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link
                    to={`/kontroll/kl/${params.row.Objekt.klient.id}/obj/${params.row.Objekt.id}/${params.row.id}`}>
                    {params.row.name}
                </Link>
            )
        },
        {
            field: 'user',
            headerName: 'Utførende',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                KontrollValueGetter(params.row).user(users)
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
                <RowAction
                    actionItems={[
                        {
                            name: 'Rediger',
                            action: () => edit(params.row.id)
                        }
                    ]}
                />
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
    users: User[];
    klienter: Klient[];
}
export const KontrollTable = ({
    kontroller,
    users,
    klienter
}: KontrollTableProps) => {
    function kontrollCustomSort<T extends keyof Kontroll>(
        data: Kontroll[],
        field: T
    ): Kontroll[] {
        switch (field.toString()) {
            case 'klient':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            KontrollValueGetter(a).klient(klienter)
                        ).localeCompare(
                            String(KontrollValueGetter(b).klient(klienter))
                        )
                    );

            case 'objekt':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            KontrollValueGetter(a).objekt(klienter)
                        ).localeCompare(
                            String(KontrollValueGetter(b).objekt(klienter))
                        )
                    );

            case 'user':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            KontrollValueGetter(a).user(users)
                        ).localeCompare(
                            String(KontrollValueGetter(b).user(users))
                        )
                    );

            default:
                return data;
        }
    }

    return <BaseTable data={kontroller} customSort={kontrollCustomSort} />;
};
