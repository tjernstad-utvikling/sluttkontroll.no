import {
    GridColDef,
    GridColumns,
    GridRowData,
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
export const kontrollColumns = (users: User[]) => {
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
            flex: 1
        },
        {
            field: 'user',
            headerName: 'Utførende',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => {
                return KontrollValueGetter(params.row).user(users);
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
    users: User[];
}
export const KontrollTable = ({ kontroller, users }: KontrollTableProps) => {
    const { columns, apiRef } = useTable();
    const [isShift, setIsShift] = useState<boolean>(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>();
    const [_kontroller, set_Kontroller] = useState<Array<Kontroll>>();

    function sort<T, K extends keyof T>(
        data: T[],
        field: K,
        mode: GridSortDirection,
        columns: GridColumns
    ): T[] {
        const column = columns.find((c) => c.field === field);
        let sortedRows: T[] = [];
        if (column !== undefined && column.valueGetter) {
            switch (field.toString()) {
                case 'klient':
                    sortedRows = data
                        .slice()
                        .sort((a, b) =>
                            String(
                                KontrollValueGetter(a)['klient']()
                            ).localeCompare(
                                String(KontrollValueGetter(b)['klient']())
                            )
                        );
                    break;
                case 'objekt':
                    sortedRows = data
                        .slice()
                        .sort((a, b) =>
                            String(
                                KontrollValueGetter(a)['objekt']()
                            ).localeCompare(
                                String(KontrollValueGetter(b)['objekt']())
                            )
                        );
                    break;
                case 'user':
                    sortedRows = data
                        .slice()
                        .sort((a, b) =>
                            String(
                                KontrollValueGetter(a)['user'](users)
                            ).localeCompare(
                                String(KontrollValueGetter(b)['user'](users))
                            )
                        );
                    break;

                default:
                    break;
            }
        } else {
            sortedRows = data
                .slice()
                .sort((a, b) =>
                    String(a[field]).localeCompare(String(b[field]))
                );
        }

        if (mode === 'desc') {
            sortedRows = sortedRows.reverse();
        }
        return sortedRows;
    }

    const handleSortMode = (sortMode: GridSortModelParams) => {
        if (sortMode.sortModel.length === 0) {
            set_Kontroller(kontroller);
            return;
        }
        const field: any = sortMode.sortModel[0].field;
        if (_kontroller !== undefined) {
            set_Kontroller(
                sort(
                    _kontroller,
                    field,
                    sortMode.sortModel[0].sort,
                    sortMode.columns
                )
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
