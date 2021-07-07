import {
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { BaseTable } from './baseTable';
import { Checklist } from '../contracts/kontrollApi';

export const SjekklisteValueGetter = (data: Checklist | GridRowData) => {
    const prosedyre = (): string => {
        return data.checkpoint.prosedyre;
    };
    const prosedyreNr = (): string => {
        return data.checkpoint.prosedyreNr;
    };
    return { prosedyre, prosedyreNr };
};
export const columns = (url: string) => {
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
            field: 'aktuell',
            headerName: 'Aktuell',
            flex: 1
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['prosedyreNr', 'prosedyre'];

interface SjekklisteTableProps {
    checklists: Array<Checklist>;
}
export const SjekklisteTable = ({ checklists }: SjekklisteTableProps) => {
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

            default:
                return data;
        }
    }

    return <BaseTable data={checklists} customSort={CustomSort} />;
};
