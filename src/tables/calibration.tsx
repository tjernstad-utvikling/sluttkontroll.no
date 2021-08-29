import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import Avatar from '@material-ui/core/Avatar';
import { BaseTable } from './baseTable';
import Chip from '@material-ui/core/Chip';
import { Kalibrering } from '../contracts/instrumentApi';
import { RowAction } from '../tables/tableUtils';
import { format } from 'date-fns';

export const CalibrationValueGetter = (data: Kalibrering | GridRowData) => {
    const date = (formatString: string): string => {
        return format(new Date(data.date), formatString);
    };

    return { date };
};
interface calibrationColumnsOptions {
    openCertificate: number;
    instrumentLastCalibration: Kalibrering | null;
}
export const calibrationColumns = ({
    openCertificate,
    instrumentLastCalibration
}: calibrationColumnsOptions) => {
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
                        {openCertificate === params.row.id && (
                            <Chip
                                variant="outlined"
                                color="primary"
                                avatar={<Avatar>Ny</Avatar>}
                                label="Siste kalibrering"
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
                <RowAction actionItems={[]} />
            )
        }
    ];

    return columns;
};

export const defaultColumns: string[] = ['date', 'status'];

interface CalibrationTableProps {
    calibrations: Kalibrering[];
}
export const CalibrationTable = ({ calibrations }: CalibrationTableProps) => {
    function customSort<T extends keyof Kalibrering>(
        data: Kalibrering[],
        field: T
    ): Kalibrering[] {
        switch (field.toString()) {
            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={calibrations}
            customSort={customSort}
            customSortFields={[]}
        />
    );
};
