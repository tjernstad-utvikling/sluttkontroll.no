import { BaseTable, RowStylingEnum } from './base/defaultTable';
import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
import BuildIcon from '@mui/icons-material/Build';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { RowAction } from './base/tableUtils';
import { format } from 'date-fns';

export const AvvikValueGetter = (data: Avvik | GridRowModel | null) => {
    const kontroll = (kontroller: Kontroll[]): string => {
        const kontroll = kontroller.find(
            (k) => k.id === data?.checklist?.skjema?.kontroll?.id
        );
        if (kontroll !== undefined) {
            return kontroll?.name || '';
        }
        return '';
    };
    const area = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find(
            (s) => s.id === data?.checklist?.skjema?.id
        );
        if (skjema !== undefined) {
            return skjema.area;
        }
        return '';
    };
    const omrade = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find(
            (s) => s.id === data?.checklist?.skjema?.id
        );
        if (skjema !== undefined) {
            return skjema.omrade;
        }
        return '';
    };
    const avvikBilder = (): number => {
        if (data?.avvikBilder && data?.avvikBilder?.length > 0) {
            return data?.avvikBilder.length;
        }
        return 0;
    };

    return { kontroll, area, omrade, avvikBilder };
};
interface ColumnsProps {
    kontroller: Kontroll[];
    skjemaer: Skjema[];
    url: string;
    deleteSkjema?: (avvikId: number) => void;
    edit?: (avvikId: number) => void;
    open?: (avvikId: number) => void;
    close?: (avvikId: number) => void;
}
export const columns = ({
    kontroller,
    skjemaer,
    url,
    deleteSkjema,
    edit,
    open,
    close
}: ColumnsProps) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'beskrivelse',
            headerName: 'Beskrivelse',
            flex: 1,
            renderCell: (params: GridCellParams) => (
                <Link to={`${url}/${params.row.id}`}>
                    {params.row.beskrivelse}
                </Link>
            )
        },
        {
            field: 'areal',
            headerName: 'Areal',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).area(skjemaer),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    AvvikValueGetter(param1.api.getRow(param1.id)).area(
                        skjemaer
                    )
                ).localeCompare(
                    String(
                        AvvikValueGetter(param2.api.getRow(param2.id)).area(
                            skjemaer
                        )
                    )
                )
        },
        {
            field: 'omrade',
            headerName: 'Område',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).omrade(skjemaer),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    AvvikValueGetter(param1.api.getRow(param1.id)).omrade(
                        skjemaer
                    )
                ).localeCompare(
                    String(
                        AvvikValueGetter(param2.api.getRow(param2.id)).omrade(
                            skjemaer
                        )
                    )
                )
        },
        {
            field: 'avvikBilder',
            headerName: 'Bilder',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).avvikBilder(),
            sortComparator: (v1, v2, param1, param2) =>
                AvvikValueGetter(param1.api.getRow(param1.id)).avvikBilder() -
                AvvikValueGetter(param2.api.getRow(param2.id)).avvikBilder()
        },
        {
            field: 'kommentar',
            headerName: 'Kommentar',
            flex: 1
        },
        {
            field: 'registrertDato',
            headerName: 'Registrert dato',
            flex: 1,
            renderCell: (params: GridCellParams) =>
                format(new Date(params.row.registrertDato), 'dd.MM.yyyy')
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
                AvvikValueGetter(params.row).kontroll(kontroller),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    AvvikValueGetter(param1.api.getRow(param1.id)).kontroll(
                        kontroller
                    )
                ).localeCompare(
                    String(
                        AvvikValueGetter(param2.api.getRow(param2.id)).kontroll(
                            kontroller
                        )
                    )
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
                    <RowAction
                        actionItems={[
                            {
                                name: 'Åpne',
                                action: () => open && open(params.row.id),
                                skip:
                                    params.row.status !== 'lukket' ||
                                    open === undefined,
                                icon: <LockOpenIcon />
                            },
                            {
                                name: 'Lukke',
                                action: () => close && close(params.row.id),
                                skip:
                                    params.row.status === 'lukket' ||
                                    close === undefined,
                                icon: <BuildIcon />
                            },
                            {
                                name: 'Rediger',
                                action: () => edit && edit(params.row.id),
                                skip:
                                    params.row.status === 'lukket' ||
                                    edit === undefined,
                                icon: <EditIcon />
                            },
                            {
                                name: 'Slett',
                                action: () =>
                                    deleteSkjema && deleteSkjema(params.row.id),
                                skip:
                                    params.row.status === 'lukket' ||
                                    deleteSkjema === undefined,
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
    'beskrivelse',
    'avvBilder',
    'kommentar',
    'status'
];

interface AvvikTableProps {
    avvik: Avvik[];
    onSelected: (ids: number[]) => void;
    selected: number[];
    leftAction?: React.ReactNode;
    skjemaClipboard?: Skjema[] | undefined;
    isLoading: boolean;
}
export const AvvikTable = ({
    avvik,
    onSelected,
    selected,
    leftAction,
    skjemaClipboard,
    isLoading
}: AvvikTableProps) => {
    const getRowStyling = (row: GridRowModel): RowStylingEnum | undefined => {
        if (skjemaClipboard?.find((sc) => sc.id === row.id)) {
            return RowStylingEnum.cut;
        }
        if (row.status === 'lukket') {
            return RowStylingEnum.completed;
        }
    };

    return (
        <BaseTable
            data={avvik}
            onSelected={onSelected}
            getRowStyling={getRowStyling}
            loading={isLoading}
            selectionModel={selected}>
            {leftAction}
        </BaseTable>
    );
};
