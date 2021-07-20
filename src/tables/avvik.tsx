import {
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { BaseTable } from './baseTable';
import { Measurement } from '../contracts/measurementApi';

export const AvvikValueGetter = (data: Measurement | GridRowData) => {
    const kontroll = (kontroller: Kontroll[]): string => {
        const kontroll = kontroller.find(
            (k) => k.id === data.Skjema.kontroll.id
        );
        if (kontroll !== undefined) {
            return kontroll?.name || '';
        }
        return '';
    };
    const skjema = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data.Skjema.id);
        if (skjema !== undefined) {
            return `${skjema?.area} - ${skjema?.omrade}` || '';
        }
        return '';
    };

    return { kontroll, skjema };
};
export const columns = (kontroller: Kontroll[], skjemaer: Skjema[]) => {
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
                MeasurementValueGetter(params.row).kontroll(kontroller)
        },
        {
            field: 'skjema',
            headerName: 'Skjema',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                MeasurementValueGetter(params.row).skjema(skjemaer)
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

interface AvvikTableProps {
    measurements: Measurement[];
    kontroller: Kontroll[];
    skjemaer: Skjema[];
}
export const AvvikTable = ({
    kontroller,
    measurements,
    skjemaer
}: AvvikTableProps) => {
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
                            AvvikValueGetter(a).kontroll(kontroller)
                        ).localeCompare(
                            String(AvvikValueGetter(b).kontroll(kontroller))
                        )
                    );
            case 'skjema':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            AvvikValueGetter(a).skjema(skjemaer)
                        ).localeCompare(
                            String(AvvikValueGetter(b).skjema(skjemaer))
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
