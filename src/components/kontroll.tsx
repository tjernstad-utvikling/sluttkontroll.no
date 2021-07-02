import * as React from 'react';

import {
    DataGrid,
    GridColDef,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { Kontroll } from '../contracts/kontrollApi';

interface KontrollTableProps {
    kontroller: Array<Kontroll>;
}
export const KontrollTable = ({ kontroller }: KontrollTableProps) => {
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
            valueGetter: (params: GridValueGetterParams) =>
                params.row.user.id || ''
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
