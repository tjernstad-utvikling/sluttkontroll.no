import * as React from 'react';

import {
    DataGrid,
    GridColDef,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { Kontroll } from '../contracts/kontrollApi';
import { useUser } from '../data/user';

interface KontrollTableProps {
    kontroller: Array<Kontroll>;
}
export const KontrollTable = ({ kontroller }: KontrollTableProps) => {
    const {
        state: { users }
    } = useUser();
    const columns: GridColDef[] = [
        {
            field: 'klient',
            headerName: 'Klient',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.Objekt.klient.name || ''
        },
        {
            field: 'object',
            headerName: 'Lokasjon',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.Objekt.name || ''
        },
        {
            field: 'name',
            headerName: 'Kontroll',
            flex: 1
        },
        {
            field: 'user',
            headerName: 'Utførende',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => {
                if (users !== undefined) {
                    const user = users.find((u) => u.id === params.row.user.id);
                    return user?.name;
                }
                return '';
            }
        },
        {
            field: 'kommentar',
            headerName: 'Kommentar',
            flex: 1
        }
    ];

    return (
        <DataGrid
            rows={kontroller}
            columns={columns}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
        />
    );
};
