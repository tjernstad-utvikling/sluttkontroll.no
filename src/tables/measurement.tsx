import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { BaseTable } from './baseTable';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Measurement } from '../contracts/measurementApi';
import { RowAction } from './tableUtils';

export const MeasurementValueGetter = (data: Measurement | GridRowData) => {
    const kontroll = (kontroller: Kontroll[]): Kontroll | undefined => {
        return kontroller.find((k) => k.id === data.skjema.kontroll.id);
    };
    const skjema = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data.skjema.id);
        if (skjema !== undefined) {
            return `${skjema?.area} - ${skjema?.omrade}` || '';
        }
        return '';
    };

    return { kontroll, skjema };
};
export const columns = (
    kontroller: Kontroll[],
    skjemaer: Skjema[],
    deleteMeasurement: (MeasurementId: number) => void,
    edit: (MeasurementId: number) => void
) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1
        },
        {
            field: 'element',
            headerName: 'Element',
            flex: 1
        },
        {
            field: 'resultat',
            headerName: 'Resultat',
            flex: 1
        },
        {
            field: 'enhet',
            headerName: 'Enhet',
            flex: 1
        },
        {
            field: 'min',
            headerName: 'Min',
            flex: 1
        },
        {
            field: 'maks',
            headerName: 'Maks',
            flex: 1
        },
        {
            field: 'kontroll',
            headerName: 'Kontroll',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                MeasurementValueGetter(params.row).kontroll(kontroller)?.name ||
                ''
        },
        {
            field: 'skjema',
            headerName: 'Skjema',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                MeasurementValueGetter(params.row).skjema(skjemaer)
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                const kontroll = MeasurementValueGetter(params.row).kontroll(
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
                                action: () => deleteMeasurement(params.row.id),
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

export const defaultColumns: Array<string> = [
    'type',
    'element',
    'resultat',
    'enhet'
];

interface MeasurementTableProps {
    measurements: Measurement[];
    kontroller: Kontroll[];
    skjemaer: Skjema[];
}
export const MeasurementTable = ({
    kontroller,
    measurements,
    skjemaer
}: MeasurementTableProps) => {
    function CustomSort<T extends keyof Measurement>(
        data: Measurement[],
        field: T
    ): Measurement[] {
        switch (field.toString()) {
            case 'kontroll':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            MeasurementValueGetter(a).kontroll(kontroller)
                        ).localeCompare(
                            String(
                                MeasurementValueGetter(b).kontroll(kontroller)
                            )
                        )
                    );
            case 'skjema':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            MeasurementValueGetter(a).skjema(skjemaer)
                        ).localeCompare(
                            String(MeasurementValueGetter(b).skjema(skjemaer))
                        )
                    );
            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={measurements}
            customSort={CustomSort}
            customSortFields={['kontroll', 'skjema']}
        />
    );
};
