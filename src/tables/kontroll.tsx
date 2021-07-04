import { GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';

import { ColumnSelect } from '../components/table';
import { DataGrid } from '@material-ui/data-grid';
import { Kontroll } from '../contracts/kontrollApi';
import { User } from '../contracts/userApi';
import { useTable } from './tableContainer';

export const kontrollColumns = (users: User[]): GridColDef[] => {
    const columns: GridColDef[] = [
        {
            field: 'klient',
            headerName: 'Klient',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.Objekt.klient.name || ''
        },
        {
            field: 'objekt',
            headerName: 'Lokasjon',
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
    const { columns } = useTable();
    const [isShift, setIsShift] = useState<boolean>(false);

    const handleKeyDown = (event: any) => {
        console.log(event);
    };

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                setIsShift(true);
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                setIsShift(false);
            }
        });

        // cleanup this component
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyDown);
        };
    }, []);
    return (
        <div>
            <ColumnSelect />
            <DataGrid
                rows={kontroller}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
                disableColumnSelector
                autoHeight
            />
        </div>
    );
};
