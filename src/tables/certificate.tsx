import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import { BaseTable } from './baseTable';
import { Sertifikat } from '../contracts/certificateApi';
import { format } from 'date-fns';

export const CertificateValueGetter = (data: Sertifikat | GridRowModel) => {
    const validTo = (formatString: string): string => {
        return format(new Date(data.validTo), formatString);
    };
    const type = (): string => {
        return data.type.name;
    };

    return { validTo, type };
};

export const columns = () => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            width: 100
        },
        {
            field: 'icon',
            headerName: '',
            width: 100,
            renderCell: (params: GridCellParams) => (
                <img
                    src={params.row.type.logoBase64}
                    alt={`Sertifikat icon for ${params.row.type.name}`}
                    style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%'
                    }}
                />
            )
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                CertificateValueGetter(params.row).type()
        },
        {
            field: 'number',
            headerName: 'Sertifikat nummer',
            flex: 1
        },
        {
            field: 'validTo',
            headerName: 'Gyldig til',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                CertificateValueGetter(params.row).validTo('dd.MM.Y')
        }
    ];

    return columns;
};

export const defaultColumns: string[] = ['icon', 'type', 'number', 'validTo'];

interface CertificateTableProps {
    certificates: Sertifikat[];
    isLoading: boolean;
}
export const CertificateTable = ({
    certificates,
    isLoading
}: CertificateTableProps) => {
    return <BaseTable data={certificates} loading={isLoading} />;
};
