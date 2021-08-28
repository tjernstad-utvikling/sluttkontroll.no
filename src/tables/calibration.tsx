import {
    GridCellParams,
    GridColDef,
    GridRowData
} from '@material-ui/data-grid';
import { Instrument, Kalibrering } from '../contracts/instrumentApi';

import { BaseTable } from './baseTable';
import { RowAction } from '../tables/tableUtils';
import { format } from 'date-fns';

export const CalibrationValueGetter = (data: Instrument | GridRowData) => {
    return {};
};
interface calibrationColumnsOptions {
    openCertificate: number;
}
export const calibrationColumns = ({
    openCertificate
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
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => <div>status</div>
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
