import { GridCellParams, GridColDef } from '@mui/x-data-grid-pro';
import { Roles, RolesDesc, Sertifikat, User } from '../contracts/userApi';

import { BaseTable } from './baseTable';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { RowAction } from './tableUtils';

interface columnsOptions {
    currentUser: User;
}
export const columns = ({ currentUser }: columnsOptions) => {
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
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                return (
                    <RowAction
                        actionItems={[
                            {
                                name: 'Rediger',
                                to: `/admin/users/${params.row.id}`,
                                skip: !currentUser.roles.includes(
                                    Roles.ROLE_EDIT_USER
                                ),
                                icon: <EditIcon />
                            }
                        ]}
                    />
                );
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['name', 'email'];

interface UserTableProps {
    users: User[];
}
export const UserTable = ({ users }: UserTableProps) => {
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
