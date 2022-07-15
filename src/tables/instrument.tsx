import { ColumnDef, Row } from '@tanstack/react-table';
import { Instrument, UserRef } from '../contracts/instrumentApi';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import EditIcon from '@mui/icons-material/Edit';
import { GroupTable } from './base/groupTable';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { RowAction } from './base/tableUtils';
import { RowStylingEnum } from './base/defaultTable';
import { TableKey } from '../contracts/keys';
import TodayIcon from '@mui/icons-material/Today';
import { Typography } from '@mui/material';
import { User } from '../contracts/userApi';
import { format } from 'date-fns';
import { useMemo } from 'react';

type InstrumentColumns = {
    id: number;
    name: string;
    serienr: string;
    sisteKalibrert: Date | undefined;
    user: string;
    disponent: UserRef | null;
    calibrationInterval: number;
    toCalibrate: boolean;
    passedCalibrationDate: boolean;
    needCalibrating: boolean;
};

export const InstrumentValueGetter = (data: Instrument | null) => {
    const sisteKalibrert = (
        formatString: string,
        date: Date | undefined
    ): string => {
        if (date !== undefined) {
            return format(new Date(date), formatString);
        }
        return 'Kalibrering ikke registrert';
    };
    const user = (notSelectedString: string): string => {
        if (data?.user !== null) {
            return data?.user.name ?? '';
        }
        return notSelectedString;
    };
    const disponent = (): string => {
        if (data?.disponent !== null) {
            return data?.disponent.name ?? '';
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
    row: Row<InstrumentColumns>;
    user: User | undefined;
    onClick: (id: number) => void;
}) => {
    if (user !== undefined) {
        const disponent: UserRef | null = row.getValue('disponent');
        if (disponent !== null && disponent !== undefined) {
            return (
                <>
                    <Button
                        onClick={() => onClick(row.getValue('id'))}
                        variant="outlined"
                        color="primary"
                        size="small">
                        {user.id === disponent.id ? 'Lever' : 'Overta'}
                    </Button>{' '}
                    <Typography style={{ paddingLeft: 5 }}>
                        {disponent.name}
                    </Typography>
                </>
            );
        }
        return (
            <>
                <Button
                    onClick={() => onClick(row.getValue('id'))}
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

interface InstrumentTableProps {
    instruments: Instrument[];
    edit: (id: number) => void;
    regCalibration: (id: number) => void;
    isLoading: boolean;
    currentUser: User | undefined;
    changeDisponent: (instrumentId: number) => void;
}
export const InstrumentTable = ({
    instruments,
    edit,
    regCalibration,
    isLoading,
    changeDisponent,
    currentUser
}: InstrumentTableProps) => {
    const data = useMemo((): InstrumentColumns[] => {
        return instruments.map((c) => {
            return {
                ...c,
                sisteKalibrert: c.sisteKalibrert
                    ? new Date(c.sisteKalibrert.date)
                    : undefined,
                user: InstrumentValueGetter(c).user('Ansvarlig ikke valgt')
            };
        });
    }, [instruments]);

    const columns: ColumnDef<InstrumentColumns>[] = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'id',
                enableGrouping: false
            },
            {
                header: 'Instrument',
                accessorKey: 'name',
                enableGrouping: false
            },
            {
                header: 'Serienummer',
                accessorKey: 'serienr',
                enableGrouping: false
            },
            {
                header: 'Siste kalibrering',
                accessorKey: 'sisteKalibrert',
                enableGrouping: false
            },
            {
                header: 'Siste kalibrering',
                accessorKey: 'sisteKalibrert',
                enableGrouping: false,
                cell: ({ cell, row }) => (
                    <>
                        <Link
                            to={`/instrument/${row.getValue(
                                'id'
                            )}/calibration`}>
                            {InstrumentValueGetter(null).sisteKalibrert(
                                'dd.MM.Y',
                                cell.getValue()
                            )}
                        </Link>
                        <IconButton
                            onClick={() => regCalibration(row.getValue('id'))}
                            aria-label="Registrer ny kalibrering"
                            size="large">
                            <AddIcon />
                        </IconButton>
                    </>
                )
            },
            {
                header: 'Disponerer instrumentet',
                accessorKey: 'disponent',
                enableGrouping: false,
                cell: ({ cell, row }) => (
                    <RenderDisponentField
                        onClick={changeDisponent}
                        row={row}
                        user={currentUser}
                    />
                )
            },
            {
                header: 'Kalibreringsinterval',
                accessorKey: 'calibrationInterval',
                enableGrouping: true
            },
            {
                header: 'Skal kalibreres',
                accessorKey: 'toCalibrate',
                enableGrouping: true,
                cell: ({ cell }) => {
                    return cell.getValue() ? (
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
                header: '',
                accessorKey: 'actions',
                enableGrouping: false,
                cell: ({ row }) => (
                    <RowAction
                        actionItems={[
                            {
                                name: 'Rediger',
                                action: () => edit(row.getValue('id')),
                                icon: <EditIcon />
                            },
                            {
                                name: 'Registrer kalibrering',
                                action: () =>
                                    regCalibration(row.getValue('id')),

                                icon: <TodayIcon />
                            }
                        ]}
                    />
                )
            }
        ],
        [changeDisponent, currentUser, edit, regCalibration]
    );

    const getRowStyling = (
        row: Row<InstrumentColumns>
    ): RowStylingEnum | undefined => {
        if (row.getValue('passedCalibrationDate')) {
            return RowStylingEnum.error;
        } else if (row.getValue('needCalibrating')) {
            return RowStylingEnum.warning;
        }
    };

    return (
        <GroupTable<InstrumentColumns>
            tableKey={TableKey.instrument}
            columns={columns}
            data={data}
            defaultGrouping={['groupCategory']}
            defaultVisibilityState={{}}
            getRowStyling={getRowStyling}
            isLoading={isLoading}
        />
    );
};
