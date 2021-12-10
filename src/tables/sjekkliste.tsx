import { BaseTable, RowStylingEnum } from './baseTable';
import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import AddIcon from '@mui/icons-material/Add';
import { Avvik } from '../contracts/avvikApi';
import { Checklist } from '../contracts/kontrollApi';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { PasteTableButton } from '../components/clipboard';
import { Link as RouterLink } from 'react-router-dom';
import { RowAction } from './tableUtils';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const SjekklisteValueGetter = (
    data: Checklist | GridRowModel | null
) => {
    const prosedyre = (): string => {
        return data?.checkpoint.prosedyre;
    };
    const prosedyreNr = (): string => {
        return data?.checkpoint.prosedyreNr;
    };
    const avvik = (avvik: Avvik[]): { open: number; closed: number } => {
        if (avvik !== undefined) {
            const avvikene = avvik.filter((a) => a.checklist.id === data?.id);

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
    toggleAktuell: (id: number) => void,
    clipboardHasAvvik: boolean,
    avvikToPast: Avvik[]
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
                SjekklisteValueGetter(params.row).prosedyreNr(),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    SjekklisteValueGetter(
                        param1.api.getRow(param1.id)
                    ).prosedyreNr()
                ).localeCompare(
                    String(
                        SjekklisteValueGetter(
                            param2.api.getRow(param2.id)
                        ).prosedyreNr()
                    )
                )
        },
        {
            field: 'prosedyre',
            headerName: 'Prosedyre',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                SjekklisteValueGetter(params.row).prosedyre(),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    SjekklisteValueGetter(
                        param1.api.getRow(param1.id)
                    ).prosedyre()
                ).localeCompare(
                    String(
                        SjekklisteValueGetter(
                            param2.api.getRow(param2.id)
                        ).prosedyre()
                    )
                )
        },
        {
            field: 'avvik',
            headerName: 'Avvik (åpne | lukket) ',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <>
                    <Link to={`${url}/checklist/${params.row.id}/avvik`}>
                        <span>
                            ({' '}
                            {
                                SjekklisteValueGetter(params.row).avvik(avvik)
                                    .open
                            }{' '}
                            |{' '}
                            {
                                SjekklisteValueGetter(params.row).avvik(avvik)
                                    .closed
                            }{' '}
                            ){' '}
                        </span>
                    </Link>
                    <IconButton
                        to={`${url}/checklist/${params.row.id}/avvik/new`}
                        component={RouterLink}
                        aria-label="nytt avvik"
                        size="large">
                        <AddIcon />
                    </IconButton>
                </>
            ),
            sortComparator: (v1, v2, param1, param2) =>
                SjekklisteValueGetter(param1.api.getRow(param1.id)).avvik(avvik)
                    .open -
                SjekklisteValueGetter(param2.api.getRow(param2.id)).avvik(avvik)
                    .open
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
                return (
                    <>
                        {clipboardHasAvvik && (
                            <PasteTableButton
                                clipboardHas={true}
                                options={{
                                    avvikPaste: {
                                        checklistId: params.row.id,
                                        avvik: avvikToPast
                                    }
                                }}
                            />
                        )}
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
                    </>
                );
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['prosedyreNr', 'prosedyre'];

interface SjekklisteTableProps {
    checklists: Array<Checklist>;
}
export const SjekklisteTable = ({ checklists }: SjekklisteTableProps) => {
    const getRowStyling = (row: GridRowModel): RowStylingEnum | undefined => {
        if (!row.aktuell) {
            return RowStylingEnum.disabled;
        }
    };

    return <BaseTable data={checklists} getRowStyling={getRowStyling} />;
};
