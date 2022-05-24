import {
    GridCellParams,
    GridColDef,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';
import { Roles, RolesDesc, User } from '../contracts/userApi';

import { BaseTable } from './base/defaultTable';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { RowAction } from './base/tableUtils';
import { Sertifikat } from '../contracts/certificateApi';

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
            valueGetter: (params: GridValueGetterParams) => {
                if (params.value.roles) return params.value.roles[0];
            },
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
                    {params.row.sertifikater?.map((sertifikat: Sertifikat) => (
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

export const defaultColumns: string[] = ['name', 'email'];

interface UserTableProps {
    users: User[];
    isLoading: boolean;
}
export const UserTable = ({ users, isLoading }: UserTableProps) => {
    return <BaseTable data={users} loading={isLoading} />;
};
