import { BaseTable, RowStylingEnum } from './base/baseTable';
import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import EditIcon from '@mui/icons-material/Edit';
import { Instrument } from '../contracts/instrumentApi';
import { Link } from 'react-router-dom';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { RowAction } from './base/tableUtils';
import TodayIcon from '@mui/icons-material/Today';
import { Typography } from '@mui/material';
import { User } from '../contracts/userApi';
import { format } from 'date-fns';

export const InstrumentValueGetter = (
    data: Instrument | GridRowModel | null
) => {
    const sisteKalibrert = (formatString: string): string => {
        if (
            data?.sisteKalibrert !== null &&
            data?.sisteKalibrert !== undefined
        ) {
            return format(new Date(data?.sisteKalibrert.date), formatString);
        }
        return 'Kalibrering ikke registrert';
    };
    const user = (notSelectedString: string): string => {
        if (data?.user !== null) {
            return data?.user.name;
        }
        return notSelectedString;
    };
    const disponent = (): string => {
        if (data?.disponent !== null) {
            return data?.disponent.name;
        }
        return '';
    };

    return { sisteKalibrert, user, disponent };
};

const RenderDisponentField = ({
    row,
    user,
    onClick
}: {
    row: Instrument | GridRowModel;
    user: User | undefined;
    onClick: (id: number) => void;
}) => {
    if (user !== undefined) {
        if (row.disponent !== null && row.disponent !== undefined) {
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
            ),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    InstrumentValueGetter(
                        param1.api.getRow(param1.id)
                    ).sisteKalibrert('Y-M-d')
                ).localeCompare(
                    String(
                        InstrumentValueGetter(
                            param2.api.getRow(param2.id)
                        ).sisteKalibrert('Y-M-d')
                    )
                )
        },
        {
            field: 'user',
            headerName: 'Ansvarlig',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                InstrumentValueGetter(params.row).user('Ansvarlig ikke valgt'),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    InstrumentValueGetter(param1.api.getRow(param1.id)).user('')
                ).localeCompare(
                    String(
                        InstrumentValueGetter(
                            param2.api.getRow(param2.id)
                        ).user('')
                    )
                )
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
            ),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    InstrumentValueGetter(
                        param1.api.getRow(param1.id)
                    ).disponent()
                ).localeCompare(
                    String(
                        InstrumentValueGetter(
                            param2.api.getRow(param2.id)
                        ).disponent()
                    )
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
    const getRowStyling = (row: GridRowModel): RowStylingEnum | undefined => {
        if (row.passedCalibrationDate) {
            return RowStylingEnum.error;
        } else if (row.needCalibrating) {
            return RowStylingEnum.warning;
        }
    };

    return <BaseTable data={instruments} getRowStyling={getRowStyling} />;
};
