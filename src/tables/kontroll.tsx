import {
    GridColDef,
    GridRowSelectedParams,
    GridSortDirection,
    GridSortModelParams,
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
    const [_kontroller, set_Kontroller] = useState<Array<Kontroll>>();

    function sort<T, K extends keyof T>(
        data: T[],
        field: K,
        mode: GridSortDirection
    ): T[] {
        let sortedRows = data
            .slice()
            .sort((a, b) => String(a[field]).localeCompare(String(b[field])));

        if (mode === 'desc') {
            sortedRows = sortedRows.reverse();
        }
        return sortedRows;
    }

    const handleSortMode = (sortMode: GridSortModelParams) => {
        console.log(sortMode);
        if (sortMode.sortModel.length === 0) {
            set_Kontroller(kontroller);
            return;
        }
        const field: any = sortMode.sortModel[0].field;
        if (_kontroller !== undefined) {
            set_Kontroller(
                sort(_kontroller, field, sortMode.sortModel[0].sort)
            );
        }
    };

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

    useEffect(() => {
        set_Kontroller(kontroller);
    }, [kontroller]);

    const handleSelect = (row: GridRowSelectedParams) => {
        if (_kontroller !== undefined) {
            const index = _kontroller.findIndex((k) => k.id === row.data.id);

            if (isShift) {
                if (lastSelectedIndex === undefined) {
                    return;
                }

                if (index === lastSelectedIndex) {
                    return;
                }
                const subsetArray = _kontroller.slice(
                    Math.min(index, lastSelectedIndex),
                    Math.max(index, lastSelectedIndex) + 1
                );

                const selectArray = subsetArray.map((k) => k.id);
                apiRef.current.selectRows(selectArray, row.isSelected);
            }

            setLastSelectedIndex(index);
        }
    };
    return (
        <div>
            <ColumnSelect />
            {_kontroller && (
                <DataGrid
                    rows={_kontroller}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                    disableSelectionOnClick
                    disableColumnSelector
                    autoHeight
                    sortingMode="server"
                    onSortModelChange={handleSortMode}
                    onRowSelected={handleSelect}
                />
            )}
        </div>
    );
};
