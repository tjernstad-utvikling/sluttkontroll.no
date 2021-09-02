import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridRowId
} from '@material-ui/data-grid';
import { Roles, RolesDesc, Sertifikat, User } from '../contracts/userApi';

import { BaseTable } from './baseTable';
import Chip from '@material-ui/core/Chip';
import { useTable } from './tableContainer';

export const columns = () => {
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
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <>
                    {params.row.roles
                        .filter((role: Roles) => role !== Roles.ROLE_USER)
                        .map((role: Roles) => (
                            <Chip
                                key={role}
                                variant="outlined"
                                size="small"
                                label={RolesDesc[role]}
                            />
                        ))}
                </>
            )
        },
        {
            field: 'sertifikater',
            headerName: 'Sertifikater',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <>
                    {params.row.sertifikater.map((sertifikat: Sertifikat) => (
                        <Chip
                            key={sertifikat.id}
                            variant="outlined"
                            size="small"
                            label={`${sertifikat.type.name} - ${sertifikat.number}`}
                        />
                    ))}
                </>
            )
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['name', 'email'];

interface UserTableProps {
    users: User[];
}
export const UserTable = ({ users }: UserTableProps) => {
    const { apiRef } = useTable();

    function CustomSort<T extends keyof User>(data: User[], field: T): User[] {
        switch (field.toString()) {
            default:
                return data;
        }
    }
    // const onSelect = () => {
    //     const rows: Map<GridRowId, GridRowData> =
    //         apiRef.current.getSelectedRows();

    //     const cpRows: User[] = [];

    //     rows.forEach((r) =>
    //         cpRows.push({
    //             name: r.name,
    //             id: r.id,
    //             email: r.email,
    //             roles: r.roles,
    //             phone: r.phone,
    //             sertifikater: r.sertifikater
    //         })
    //     );
    //     onSelected(cpRows);
    // };

    return (
        <BaseTable data={users} customSort={CustomSort} customSortFields={[]} />
    );
};
