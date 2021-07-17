import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { BaseTable } from './baseTable';
import { Kontroll } from '../contracts/kontrollApi';
import { Link } from 'react-router-dom';
import { RowAction } from '../tables/tableUtils';
import { User } from '../contracts/userApi';

export const KontrollValueGetter = (data: Kontroll | GridRowData) => {
    const klient = (): string => {
        return data.Objekt.klient.name || '';
    };
    const objekt = (): string => {
        return data.Objekt.name || '';
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
                KontrollValueGetter(params.row).klient()
        },
        {
            field: 'objekt',
            headerName: 'Lokasjon',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                KontrollValueGetter(params.row).objekt()
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
}
export const KontrollTable = ({ kontroller, users }: KontrollTableProps) => {
    function kontrollCustomSort<T extends keyof Kontroll>(
        data: Kontroll[],
        field: T
    ): Kontroll[] {
        switch (field.toString()) {
            case 'klient':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(KontrollValueGetter(a).klient()).localeCompare(
                            String(KontrollValueGetter(b).klient())
                        )
                    );

            case 'objekt':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(KontrollValueGetter(a).objekt()).localeCompare(
                            String(KontrollValueGetter(b).objekt())
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
