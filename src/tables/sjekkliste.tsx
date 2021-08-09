import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { Avvik } from '../contracts/avvikApi';
import { BaseTable } from './baseTable';
import { Checklist } from '../contracts/kontrollApi';
import { Link } from 'react-router-dom';
import { RowAction } from './tableUtils';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export const SjekklisteValueGetter = (data: Checklist | GridRowData) => {
    const prosedyre = (): string => {
        return data.checkpoint.prosedyre;
    };
    const prosedyreNr = (): string => {
        return data.checkpoint.prosedyreNr;
    };
    const avvik = (avvik: Avvik[]): { open: number; closed: number } => {
        if (avvik !== undefined) {
            const avvikene = avvik.filter((a) => a.checklist.id === data.id);

            return {
                open: avvikene.filter((a) => a.status !== 'lukket').length,
                closed: avvikene.filter((a) => a.status === 'lukket').length
            };
        }
        return { open: 0, closed: 0 };
    };
    return { prosedyre, prosedyreNr, avvik };
};
export const columns = (
    avvik: Avvik[],
    url: string,
    toggleAktuell: (id: number) => void
) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'prosedyreNr',
            headerName: 'Prosedyre nr',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                SjekklisteValueGetter(params.row).prosedyreNr()
            // renderCell: (params: GridCellParams) => (
            //     <Link to={`${url}/skjema/${params.row.id}`}>
            //         {params.row.area}
            //     </Link>
            // )
        },
        {
            field: 'prosedyre',
            headerName: 'Prosedyre',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                SjekklisteValueGetter(params.row).prosedyre()
        },
        {
            field: 'avvik',
            headerName: 'Avvik (åpne | lukket) ',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link to={`${url}/checklist/${params.row.id}/avvik`}>
                    <span>
                        ({SjekklisteValueGetter(params.row).avvik(avvik).open} |{' '}
                        {SjekklisteValueGetter(params.row).avvik(avvik).closed}{' '}
                        ){' '}
                    </span>
                </Link>
            )
        },
        {
            field: 'aktuell',
            headerName: 'Aktuell',
            flex: 1,
            renderCell: (params: GridCellParams) =>
                params.row.aktuell ? (
                    <VisibilityIcon />
                ) : (
                    <>
                        <VisibilityOffIcon />
                        <Typography style={{ paddingLeft: 10 }}>
                            Ikke aktuell
                        </Typography>
                    </>
                )
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                // const kontroll = SkjemaValueGetter(params.row).kontroll(
                //     kontroller
                // );
                return (
                    <RowAction
                        actionItems={[
                            {
                                name: params.row.aktuell
                                    ? 'sett: Ikke aktuell'
                                    : 'sett: aktuell',
                                action: () => toggleAktuell(params.row.id),
                                // skip: kontroll?.done || false,
                                icon: params.row.aktuell ? (
                                    <VisibilityOffIcon />
                                ) : (
                                    <VisibilityIcon />
                                )
                            }
                        ]}
                    />
                );
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['prosedyreNr', 'prosedyre'];

interface SjekklisteTableProps {
    checklists: Array<Checklist>;
    avvik: Array<Avvik>;
}
export const SjekklisteTable = ({
    checklists,
    avvik
}: SjekklisteTableProps) => {
    function CustomSort<T extends keyof Checklist>(
        data: Checklist[],
        field: T
    ): Checklist[] {
        switch (field.toString()) {
            case 'prosedyre':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            SjekklisteValueGetter(a).prosedyre()
                        ).localeCompare(
                            String(SjekklisteValueGetter(b).prosedyre())
                        )
                    );
            case 'prosedyreNr':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(
                            SjekklisteValueGetter(a).prosedyreNr()
                        ).localeCompare(
                            String(SjekklisteValueGetter(b).prosedyreNr()),
                            undefined,
                            { numeric: true, sensitivity: 'base' }
                        )
                    );
            case 'avvik':
                return data
                    .slice()
                    .sort(
                        (a, b) =>
                            SjekklisteValueGetter(a).avvik(avvik).open -
                            SjekklisteValueGetter(b).avvik(avvik).open
                    );

            default:
                return data;
        }
    }

    const getRowStyling = (row: GridRowData) => {
        if (!row.aktuell) {
            return 'disabled';
        }
    };

    return (
        <BaseTable
            data={checklists}
            customSort={CustomSort}
            customSortFields={['prosedyre', 'prosedyreNr', 'avvik']}
            getRowStyling={getRowStyling}
        />
    );
};
