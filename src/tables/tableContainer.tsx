import { createContext, useContext, useMemo, useState } from 'react';
import { useEffect, useRef } from 'react';

import { GridColDef } from '@material-ui/data-grid';
import { StorageKeys } from '../contracts/keys';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useTable = () => {
    return useContext(Context);
};

export const TableContainer = ({
    children,
    columns,
    defaultColumns,
    tableId
}: {
    children: React.ReactNode;
    columns: GridColDef[];
    tableId: string;
    defaultColumns: Array<string>;
}): JSX.Element => {
    const [visibleColumns, setVisibleColumns] = useState<Array<string>>([]);
    const returnColumns = useRef<GridColDef[]>();

    const apiRef = useRef<any>(null);
    const _columns = useMemo(
        () =>
            columns.concat({
                field: '__HIDDEN__',
                width: 0,
                renderCell: (params) => {
                    apiRef.current = params.api;
                    return null;
                }
            }),
        [columns]
    );

    if (visibleColumns.length === 0) {
        const savedColumnsJson = localStorage.getItem(
            `${StorageKeys.tableColumns}${tableId}`
        );
        if (savedColumnsJson === null) {
            setVisibleColumns(defaultColumns);
        } else {
            setVisibleColumns(JSON.parse(savedColumnsJson));
        }
    }

    returnColumns.current = _columns.map((c) => {
        if (c.field === '__HIDDEN__' || c.field === 'action') {
            return c;
        }
        return { ...c, hide: !visibleColumns.includes(c.field) };
    });

    useEffect(() => {
        returnColumns.current = _columns.map((c) => {
            if (c.field === '__HIDDEN__' || c.field === 'action') {
                return c;
            }
            return { ...c, hide: !visibleColumns.includes(c.field) };
        });
    }, [_columns, visibleColumns]);

    const toggleColumn = (columnId: string) => {
        if (visibleColumns.includes(columnId)) {
            setVisibleColumns((prevColumns) => {
                const columns = prevColumns.filter((c) => c !== columnId);
                localStorage.setItem(
                    `${StorageKeys.tableColumns}${tableId}`,
                    JSON.stringify(columns)
                );
                return columns;
            });
        } else {
            setVisibleColumns((prevColumns) => {
                const columns = [...prevColumns, columnId];
                localStorage.setItem(
                    `${StorageKeys.tableColumns}${tableId}`,
                    JSON.stringify(columns)
                );
                return columns;
            });
        }
    };
    return (
        <Context.Provider
            value={{
                columns: returnColumns.current,
                toggleColumn,
                apiRef
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    columns: GridColDef[];
    toggleColumn: (columnId: string) => void;
    apiRef: React.MutableRefObject<any>;
}
