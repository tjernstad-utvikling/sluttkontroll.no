import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import { BaseTable } from './baseTable';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import EditIcon from '@mui/icons-material/Edit';
import { Instrument } from '../contracts/instrumentApi';
import { Link } from 'react-router-dom';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { RowAction } from '../tables/tableUtils';
import TodayIcon from '@mui/icons-material/Today';
import { Typography } from '@mui/material';
import { User } from '../contracts/userApi';
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

const RenderDisponentField = ({
    row,
    user,
    onClick
}: {
    row: Instrument | GridRowData;
    user: User | undefined;
    onClick: (id: number) => void;
}) => {
    if (user !== undefined) {
        if (row.disponent !== null) {
            return (
                <>
                    <Button
                        onClick={() => onClick(row.id)}
                        variant="outlined"
                        color="primary"
                        size="small">
                        {user.id === row.disponent.id ? 'Lever' : 'Overta'}
                    </Button>{' '}
                    <Typography style={{ paddingLeft: 5 }}>
                        {row.disponent.name}
                    </Typography>
                </>
            );
        }
        return (
            <>
                <Button
                    onClick={() => onClick(row.id)}
                    variant="outlined"
                    color="primary"
                    size="small">
                    Book
                </Button>{' '}
                <Typography style={{ paddingLeft: 5 }}>Ingen</Typography>
            </>
        );
    }
    return <div />;
};
interface instrumentColumnsOptions {
    edit: (id: number) => void;
    regCalibration: (id: number) => void;
    currentUser: User | undefined;
    changeDisponent: (instrumentId: number) => void;
}
export const instrumentColumns = ({
    edit,
    regCalibration,
    currentUser,
    changeDisponent
}: instrumentColumnsOptions) => {
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
                <Link to={`/instrument/${params.row.id}/calibration`}>
                    {InstrumentValueGetter(params.row).sisteKalibrert(
                        'dd.MM.Y'
                    )}
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
            renderCell: (params: GridCellParams) => (
                <RenderDisponentField
                    onClick={changeDisponent}
                    row={params.row}
                    user={currentUser}
                />
            )
        },
        {
            field: 'calibrationInterval',
            headerName: 'Kalibreringsinterval',
            flex: 1
        },
        {
            field: 'toCalibrate',
            headerName: 'Skal kalibreres',
            flex: 1,
            renderCell: (params: GridCellParams) => {
                return params.row.toCalibrate ? (
                    <Chip
                        variant="outlined"
                        icon={<CompassCalibrationIcon />}
                        label="Skal kalibreres"
                    />
                ) : (
                    <Chip variant="outlined" icon={<NotInterestedIcon />} />
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
                <RowAction
                    actionItems={[
                        {
                            name: 'Rediger',
                            action: () => edit(params.row.id),
                            skip: params.row.done,
                            icon: <EditIcon />
                        },
                        {
                            name: 'Registrer kalibrering',
                            action: () => regCalibration(params.row.id),
                            skip: params.row.done,
                            icon: <TodayIcon />
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
                            InstrumentValueGetter(a).sisteKalibrert('Y-M-d')
                        ).localeCompare(
                            String(
                                InstrumentValueGetter(b).sisteKalibrert('Y-M-d')
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
