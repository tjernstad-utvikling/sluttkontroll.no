import {
    GridColDef,
    GridRowSelectedParams,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { useEffect, useState } from 'react';

import { ColumnSelect } from '../components/table';
import { DataGrid } from '@material-ui/data-grid';
import { Kontroll } from '../contracts/kontrollApi';
import { User } from '../contracts/userApi';
import { useTable } from './tableContainer';

export const kontrollColumns = (users: User[]): GridColDef[] => {
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
    const { columns, apiRef } = useTable();
    const [isShift, setIsShift] = useState<boolean>(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>();

    useEffect(() => {
        const handleKey = (event: KeyboardEvent, down: boolean) => {
            if (event.key === 'Shift') {
                setIsShift(down);
            }
        };
        window.addEventListener('keydown', (e) => handleKey(e, true));
        window.addEventListener('keyup', (e) => handleKey(e, false));

        // cleanup this component
        return () => {
            window.removeEventListener('keydown', (e) => handleKey(e, true));
            window.removeEventListener('keyup', (e) => handleKey(e, false));
        };
    }, []);

    const handleSelect = (row: GridRowSelectedParams) => {
        const index = kontroller.findIndex((k) => k.id === row.data.id);

        if (isShift) {
            if (lastSelectedIndex === undefined) {
                return;
            }

            if (index === lastSelectedIndex) {
                return;
            }
            const subsetArray = kontroller.slice(
                Math.min(index, lastSelectedIndex),
                Math.max(index, lastSelectedIndex) + 1
            );

            const selectArray = subsetArray.map((k) => k.id);
            apiRef.current.selectRows(selectArray, row.isSelected);
        }

        setLastSelectedIndex(index);
    };
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
                onRowSelected={handleSelect}
            />
        </div>
    );
};
