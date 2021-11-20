import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import Avatar from '@mui/material/Avatar';
import { BaseTable } from './baseTable';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Kalibrering } from '../contracts/instrumentApi';
import { Sertifikat } from '../contracts/certificate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';

export const CertificateValueGetter = (data: Kalibrering | GridRowData) => {
    const date = (formatString: string): string => {
        return format(new Date(data.date), formatString);
    };

    return { date };
};
interface certificateColumnsOptions {
    openCertificateId: number | undefined;
    instrumentLastCalibration: Kalibrering | null;
    openCertificate: (calibrationId: number) => Promise<void>;
}
export const certificateColumns = ({
    openCertificate,
    instrumentLastCalibration,
    openCertificateId
}: certificateColumnsOptions) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'date',
            headerName: 'Dato',
            width: 180,
            valueGetter: (params: GridValueGetterParams) =>
                CalibrationValueGetter(params.row).date('dd.MM.Y')
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                return (
                    <>
                        {instrumentLastCalibration?.id === params.row.id && (
                            <Chip
                                variant="outlined"
                                color="primary"
                                avatar={<Avatar>Ny</Avatar>}
                                label="Siste kalibrering"
                            />
                        )}
                        {openCertificateId === params.row.id && (
                            <Chip
                                variant="outlined"
                                color="primary"
                                icon={<VisibilityIcon />}
                                label="Åpen"
                            />
                        )}
                    </>
                );
            }
        },

        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => openCertificate(params.row.id)}>
                    Åpne
                </Button>
            )
        }
    ];

    return columns;
};

export const defaultColumns: string[] = ['type', 'number', 'validTo'];

interface CertificateTableProps {
    certificate: Sertifikat[];
}
export const CertificateTable = ({ certificate }: CertificateTableProps) => {
    return <BaseTable data={certificate} />;
};
