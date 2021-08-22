import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { BaseTable } from './baseTable';
import EditIcon from '@material-ui/icons/Edit';
import { Instrument } from '../contracts/instrumentApi';
import { Link } from 'react-router-dom';
import { RowAction } from '../tables/tableUtils';
import { format } from 'date-fns';

export const InstrumentValueGetter = (data: Instrument | GridRowData) => {
    const sisteKalibrert = (formatString: string): string => {
        if (data.sisteKalibrert !== null) {
            return format(new Date(data.sisteKalibrert.date), formatString);
        }
        return 'Kalibrering ikke registrert';
    };
    const user = (notSelectedString: string): string => {
        if (data.user !== null) {
            return data.user.name;
        }
        return notSelectedString;
    };

    return { sisteKalibrert, user };
};
export const instrumentColumns = (edit: (id: number) => void) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Instrument',
            flex: 1
        },
        {
            field: 'serienr',
            headerName: 'Serienummer',
            flex: 1
        },
        {
            field: 'sisteKalibrert',
            headerName: 'Siste kalibrering',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link to={`/instrument`}>
                    {InstrumentValueGetter(params.row).sisteKalibrert('d.m.Y')}
                </Link>
            )
        },
        {
            field: 'user',
            headerName: 'Ansvarlig',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                InstrumentValueGetter(params.row).user('Ansvarlig ikke valgt')
        },
        {
            field: 'disponent',
            headerName: 'Disponerer instrumentet',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                InstrumentValueGetter(params.row).user('Ingen')
        },
        {
            field: 'calibrationInterval',
            headerName: 'Kalibreringsinterval',
            flex: 1
        },
        {
            field: 'toCalibrate',
            headerName: 'Skal kalibreres',
            flex: 1
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <RowAction
                    actionItems={[
                        {
                            name: 'Rediger',
                            action: () => edit(params.row.id),
                            skip: params.row.done,
                            icon: <EditIcon />
                        }
                    ]}
                />
            )
        }
    ];

    return columns;
};

export const defaultColumns: string[] = [
    'name',
    'serienr',
    'sisteKalibrert',
    'disponent',
    'user'
];

interface InstrumentTableProps {
    instruments: Instrument[];
}
export const InstrumentTable = ({ instruments }: InstrumentTableProps) => {
    function instrumentCustomSort<T extends keyof Instrument>(
        data: Instrument[],
        field: T
    ): Instrument[] {
        switch (field.toString()) {
            case 'sisteKalibrert':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            InstrumentValueGetter(a).sisteKalibrert('Y-m-d')
                        ).localeCompare(
                            String(
                                InstrumentValueGetter(b).sisteKalibrert('Y-m-d')
                            )
                        )
                    );
            case 'user':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(InstrumentValueGetter(a).user('')).localeCompare(
                            String(InstrumentValueGetter(b).user(''))
                        )
                    );
            case 'disponent':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(InstrumentValueGetter(a).user('')).localeCompare(
                            String(InstrumentValueGetter(b).user(''))
                        )
                    );

            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={instruments}
            customSort={instrumentCustomSort}
            customSortFields={['sisteKalibrert', 'user', 'disponent']}
        />
    );
};
