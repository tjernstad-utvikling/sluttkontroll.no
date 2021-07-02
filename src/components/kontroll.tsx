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
            field: 'name',
            headerName: 'Kontroll'
        },
        {
            field: 'klient',
            headerName: 'Klient',
            sortable: false,
            width: 160,
            valueGetter: (params: GridValueGetterParams) => params.row || ''
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
