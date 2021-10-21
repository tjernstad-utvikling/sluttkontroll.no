import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
import { BaseTable } from './baseTable';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { Measurement } from '../contracts/measurementApi';
import { RowAction } from './tableUtils';

export const SkjemaValueGetter = (data: Skjema | GridRowData) => {
    const kontroll = (kontroller: Kontroll[]): Kontroll | undefined => {
        return kontroller.find((k) => k.id === data.kontroll.id);
    };

    const avvik = (avvik: Avvik[]): { open: number; closed: number } => {
        if (avvik !== undefined) {
            const avvikene = avvik.filter(
                (a) => a.checklist.skjema.id === data.id
            );

            return {
                open: avvikene.filter((a) => a.status !== 'lukket').length,
                closed: avvikene.filter((a) => a.status === 'lukket').length
            };
        }
        return { open: 0, closed: 0 };
    };

    const measurement = (measurements: Measurement[]): number => {
        if (measurements !== undefined) {
            const filteredMeasurements = measurements.filter(
                (m) => m.skjema.id === data.id
            );

            return filteredMeasurements.length;
        }

        return 0;
    };

    return { kontroll, avvik, measurement };
};
export const columns = (
    kontroller: Kontroll[],
    avvik: Avvik[],
    measurements: Measurement[],
    url: string,
    deleteSkjema: (skjemaId: number) => void,
    edit: (skjemaId: number) => void,
    skipLink?: boolean
) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'area',
            headerName: 'Areal',
            flex: 1,
            renderCell: (params: GridCellParams) =>
                skipLink ? (
                    params.row.area
                ) : (
                    <Link to={`${url}/skjema/${params.row.id}`}>
                        {params.row.area}
                    </Link>
                )
        },
        {
            field: 'omrade',
            headerName: 'Område',
            flex: 1
        },

        {
            field: 'kontroll',
            headerName: 'Kontroll',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                SkjemaValueGetter(params.row).kontroll(kontroller)?.name || '',
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    SkjemaValueGetter(param1.api.getRow(param1.id)).kontroll(
                        kontroller
                    )?.name || ''
                ).localeCompare(
                    String(
                        SkjemaValueGetter(
                            param2.api.getRow(param2.id)
                        ).kontroll(kontroller)?.name || ''
                    )
                )
        },
        {
            field: 'avvik',
            headerName: 'Avvik (åpne | lukket) ',
            flex: 1,
            renderCell: (params: GridCellParams) =>
                skipLink ? (
                    <span>
                        ({SkjemaValueGetter(params.row).avvik(avvik).open} |{' '}
                        {SkjemaValueGetter(params.row).avvik(avvik).closed} ){' '}
                    </span>
                ) : (
                    <Link to={`${url}/skjema/${params.row.id}/avvik`}>
                        <span>
                            ({SkjemaValueGetter(params.row).avvik(avvik).open} |{' '}
                            {SkjemaValueGetter(params.row).avvik(avvik).closed}{' '}
                            ){' '}
                        </span>
                    </Link>
                ),
            sortComparator: (v1, v2, param1, param2) =>
                SkjemaValueGetter(param1.api.getRow(param1.id)).avvik(avvik)
                    .open -
                SkjemaValueGetter(param2.api.getRow(param2.id)).avvik(avvik)
                    .open
        },
        {
            field: 'measurement',
            headerName: 'Målinger',
            flex: 1,
            renderCell: (params: GridCellParams) =>
                skipLink ? (
                    SkjemaValueGetter(params.row).measurement(measurements)
                ) : (
                    <Link to={`${url}/skjema/${params.row.id}/measurement`}>
                        {SkjemaValueGetter(params.row).measurement(
                            measurements
                        )}
                    </Link>
                ),
            sortComparator: (v1, v2, param1, param2) =>
                SkjemaValueGetter(param1.api.getRow(param1.id)).measurement(
                    measurements
                ) -
                SkjemaValueGetter(param2.api.getRow(param2.id)).measurement(
                    measurements
                )
        },
        {
            field: 'kommentar',
            headerName: 'Kommentar',
            flex: 1
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                const kontroll = SkjemaValueGetter(params.row).kontroll(
                    kontroller
                );
                return (
                    <RowAction
                        actionItems={[
                            {
                                name: 'Rediger',
                                action: () => edit(params.row.id),
                                skip: kontroll?.done || false,
                                icon: <EditIcon />
                            },
                            {
                                name: 'Slett',
                                action: () => deleteSkjema(params.row.id),
                                skip: kontroll?.done || false,
                                icon: <DeleteForeverIcon />
                            }
                        ]}
                    />
                );
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['area', 'omrade', 'kontroll'];

interface SkjemaTableProps {
    skjemaer: Skjema[];
    kontroller: Kontroll[];
    avvik: Avvik[];
    measurements: Measurement[];
    onSelected: (ids: number[]) => void;
}
export const SkjemaTable = ({
    skjemaer,
    kontroller,
    avvik,
    measurements,
    onSelected
}: SkjemaTableProps) => {
    function CustomSort<T extends keyof Skjema>(
        data: Skjema[],
        field: T
    ): Skjema[] {
        switch (field.toString()) {
            default:
                return data;
        }
    }

    return (
        <BaseTable
            onSelected={onSelected}
            data={skjemaer}
            customSort={CustomSort}
            customSortFields={[]}
        />
    );
};
