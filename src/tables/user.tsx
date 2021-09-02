import { GridColDef, GridRowData, GridRowId } from '@material-ui/data-grid';
import { useEffect, useMemo } from 'react';

import { BaseTable } from './baseTable';
import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import { User } from '../contracts/userApi';
import { useTable } from './tableContainer';

export const columns = (url: string) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Navn',
            flex: 1
        },
        {
            field: 'email',
            headerName: 'Epost',
            flex: 1
        },
        {
            field: 'roles',
            headerName: 'Roller',
            flex: 1
        },
        {
            field: 'sertifikater',
            headerName: 'Sertifikater',
            flex: 1
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['name', 'email'];

interface UserTableProps {
    users: User[];
    onSelected: (users: User[]) => void;
}
export const UserTable = ({ users, onSelected }: UserTableProps) => {
    const { apiRef } = useTable();

    function CustomSort<T extends keyof User>(data: User[], field: T): User[] {
        switch (field.toString()) {
            default:
                return data;
        }
    }
    const onSelect = () => {
        const rows: Map<GridRowId, GridRowData> =
            apiRef.current.getSelectedRows();

        const cpRows: User[] = [];

        rows.forEach((r) =>
            cpRows.push({
                name: r.name,
                id: r.id,
                email: r.email,
                roles: r.roles,
                phone: r.phone,
                sertifikater: r.sertifikater
            })
        );
        onSelected(cpRows);
    };

    return (
        <BaseTable
            onSelected={onSelect}
            data={users}
            customSort={CustomSort}
            customSortFields={[]}
        />
    );
};
