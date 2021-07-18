import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
import { BaseTable } from './baseTable';
import { Link } from 'react-router-dom';

export const SkjemaValueGetter = (data: Skjema | GridRowData) => {
    const kontroll = (kontroller: Kontroll[]): string => {
        const kontroll = kontroller.find((k) => k.id === data.kontroll.id);
        if (kontroll !== undefined) {
            return kontroll?.name || '';
        }
        return '';
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

    return { kontroll, avvik };
};
export const columns = (
    kontroller: Kontroll[],
    avvik: Avvik[],
    url: string
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
            renderCell: (params: GridCellParams) => (
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
                SkjemaValueGetter(params.row).kontroll(kontroller)
        },
        {
            field: 'avvik',
            headerName: 'Avvik (åpne | lukket) ',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <span>
                    ({SkjemaValueGetter(params.row).avvik(avvik).open} |{' '}
                    {SkjemaValueGetter(params.row).avvik(avvik).closed} ){' '}
                </span>
            )
        },
        {
            field: 'kommentar',
            headerName: 'Kommentar',
            flex: 1
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['area', 'omrade', 'kontroll'];

interface SkjemaTableProps {
    skjemaer: Array<Skjema>;
    kontroller: Array<Kontroll>;
    avvik: Avvik[];
}
export const SkjemaTable = ({
    skjemaer,
    kontroller,
    avvik
}: SkjemaTableProps) => {
    function CustomSort<T extends keyof Skjema>(
        data: Skjema[],
        field: T
    ): Skjema[] {
        switch (field.toString()) {
            case 'kontroll':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            SkjemaValueGetter(a).kontroll(kontroller)
                        ).localeCompare(
                            String(SkjemaValueGetter(b).kontroll(kontroller))
                        )
                    );
            case 'avvik':
                return data
                    .slice()
                    .sort(
                        (a, b) =>
                            SkjemaValueGetter(a).avvik(avvik).open -
                            SkjemaValueGetter(b).avvik(avvik).open
                    );

            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={skjemaer}
            customSort={CustomSort}
            customSortFields={['kontroll', 'avvik']}
        />
    );
};
