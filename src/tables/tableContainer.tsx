import { createContext, useContext, useState } from 'react';
import { useEffect, useRef } from 'react';

import { GridColDef } from '@material-ui/data-grid';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useTable = () => {
    return useContext(Context);
};

export const TableContainer = ({
    children,
    columns,
    defaultColumns
}: {
    children: React.ReactNode;
    columns: GridColDef[];
    // tableId: string;
    defaultColumns: Array<string>;
}): JSX.Element => {
    const [visibleColumns, setVisibleColumns] = useState<Array<string>>([]);
    const returnColumns = useRef<GridColDef[]>();
    if (visibleColumns.length === 0) {
        setVisibleColumns(defaultColumns);
    }

    returnColumns.current = columns.map((c) => {
        return { ...c, hide: !visibleColumns.includes(c.field) };
    });

    useEffect(() => {
        returnColumns.current = columns.map((c) => {
            return { ...c, hide: !visibleColumns.includes(c.field) };
        });
    }, [columns, visibleColumns]);

    const toggleColumn = (columnId: string) => {
        if (visibleColumns.includes(columnId)) {
            setVisibleColumns((prevColumns) => {
                return prevColumns.filter((c) => c !== columnId);
            });
        } else {
            setVisibleColumns((prevColumns) => {
                return [...prevColumns, columnId];
            });
        }
    };
    return (
        <Context.Provider
            value={{
                columns: returnColumns.current,
                toggleColumn
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    columns: GridColDef[];
    toggleColumn: (columnId: string) => void;
}
