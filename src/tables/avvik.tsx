import {
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
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
    const area = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data.Skjema.id);
        if (skjema !== undefined) {
            return skjema.area;
        }
        return '';
    };
    const omrade = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data.Skjema.id);
        if (skjema !== undefined) {
            return skjema.omrade;
        }
        return '';
    };

    return { kontroll, area, omrade };
};
export const columns = (kontroller: Kontroll[], skjemaer: Skjema[]) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'beskrivelse',
            headerName: 'Beskrivelse',
            flex: 1
        },
        {
            field: 'areal',
            headerName: 'Areal',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).area(skjemaer)
        },
        {
            field: 'omrade',
            headerName: 'Område',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).omrade(skjemaer)
        },
        {
            field: 'avvikBilder',
            headerName: 'Bilder',
            flex: 1
        },
        {
            field: 'kommentar',
            headerName: 'Kommentar',
            flex: 1
        },
        {
            field: 'registrertDato',
            headerName: 'Registrert dato',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1
        },
        {
            field: 'kontroll',
            headerName: 'Kontroll',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).kontroll(kontroller)
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = [
    'beskrivelse',
    'avvBilder',
    'kommentar',
    'status'
];

interface AvvikTableProps {
    avvik: Avvik[];
    kontroller: Kontroll[];
    skjemaer: Skjema[];
}
export const AvvikTable = ({
    kontroller,
    avvik,
    skjemaer
}: AvvikTableProps) => {
    function CustomSort<T extends keyof Avvik>(
        data: Avvik[],
        field: T
    ): Avvik[] {
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
            case 'area':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            AvvikValueGetter(a).area(skjemaer)
                        ).localeCompare(
                            String(AvvikValueGetter(b).area(skjemaer))
                        )
                    );
            case 'omrade':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            AvvikValueGetter(a).omrade(skjemaer)
                        ).localeCompare(
                            String(AvvikValueGetter(b).omrade(skjemaer))
                        )
                    );
            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={avvik}
            customSort={CustomSort}
            customSortFields={['kontroll', 'area', 'omrade']}
        />
    );
};
