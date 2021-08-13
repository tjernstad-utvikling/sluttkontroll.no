import { BaseTable, RowStylingEnum } from './baseTable';
import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridRowId,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { Kontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
import BuildIcon from '@material-ui/icons/Build';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { RowAction } from './tableUtils';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useTable } from './tableContainer';

export const AvvikValueGetter = (data: Avvik | GridRowData) => {
    const kontroll = (kontroller: Kontroll[]): string => {
        const kontroll = kontroller.find(
            (k) => k.id === data.checklist.skjema.kontroll.id
        );
        if (kontroll !== undefined) {
            return kontroll?.name || '';
        }
        return '';
    };
    const area = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data.checklist.skjema.id);
        if (skjema !== undefined) {
            return skjema.area;
        }
        return '';
    };
    const omrade = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data.checklist.skjema.id);
        if (skjema !== undefined) {
            return skjema.omrade;
        }
        return '';
    };
    const avvikBilder = (): number => {
        if (data.avvikBilder.length > 0) {
            return data.avvikBilder.length;
        }
        return 0;
    };

    return { kontroll, area, omrade, avvikBilder };
};
export const columns = (
    kontroller: Kontroll[],
    skjemaer: Skjema[],
    deleteSkjema: (avvikId: number) => void,
    edit: (avvikId: number) => void,
    open: (avvikId: number) => void,
    close: (avvikId: number) => void
) => {
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
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                AvvikValueGetter(params.row).avvikBilder()
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
                AvvikValueGetter(params.row).kontroll(kontroller)
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
                                action: () => open(params.row.id),
                                skip: params.row.status !== 'lukket',
                                icon: <LockOpenIcon />
                            },
                            {
                                name: 'Lukke',
                                action: () => close(params.row.id),
                                skip: params.row.status === 'lukket',
                                icon: <BuildIcon />
                            },
                            {
                                name: 'Rediger',
                                action: () => edit(params.row.id),
                                skip: params.row.status === 'lukket',
                                icon: <EditIcon />
                            },
                            {
                                name: 'Slett',
                                action: () => deleteSkjema(params.row.id),
                                skip: params.row.status === 'lukket',
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
    kontroller: Kontroll[];
    skjemaer: Skjema[];
    onSelected: (checkpoints: Array<Avvik>) => void;
    selected: Avvik[];
    selectedFromGrid: boolean;
}
export const AvvikTable = ({
    kontroller,
    avvik,
    skjemaer,
    onSelected,
    selected,
    selectedFromGrid
}: AvvikTableProps) => {
    const { apiRef } = useTable();

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
            case 'avvikBilder':
                return data
                    .slice()
                    .sort(
                        (a, b) =>
                            AvvikValueGetter(a).avvikBilder() -
                            AvvikValueGetter(b).avvikBilder()
                    );
            default:
                return data;
        }
    }

    const onSelect = () => {
        const rows: Map<GridRowId, GridRowData> =
            apiRef.current.getSelectedRows();

        const cpRows: Avvik[] = [];

        rows.forEach((r) =>
            cpRows.push({
                id: r.id,
                beskrivelse: r.beskrivelse,
                avvikBilder: r.avvikBilder,
                checklist: r.checklist,
                kommentar: r.kommentar,
                registrertDato: r.registrertDato,
                status: r.status,
                oppdagetAv: r.oppdagetAv,
                utbedrer: r.utbedrer
            })
        );
        onSelected(cpRows);
    };
    useEffect(() => {
        function checkSelected() {
            if (apiRef.current !== null && selectedFromGrid) {
                console.log('set selected in table');
                const selectArray = selected.map((a) => a.id);
                apiRef.current.selectRows(selectArray);
            }
        }
        if (apiRef.current === null && selectedFromGrid) {
            setTimeout(checkSelected, 1000);
        } else if (apiRef.current !== null && selectedFromGrid) {
            checkSelected();
        }
    }, [selected, apiRef, selectedFromGrid]);

    const getRowStyling = (row: GridRowData): RowStylingEnum | undefined => {
        if (row.status === 'lukket') {
            return RowStylingEnum.completed;
        }
    };

    return (
        <BaseTable
            data={avvik}
            onSelected={onSelect}
            customSort={CustomSort}
            customSortFields={['kontroll', 'area', 'omrade']}
            getRowStyling={getRowStyling}
            skipShift={selectedFromGrid}
        />
    );
};
