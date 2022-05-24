import { BaseTable, RowStylingEnum } from './base/defaultTable';
import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';
import { Kontroll, Skjema } from '../contracts/kontrollApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { RowAction } from './base/tableUtils';
import { useClipBoard } from '../data/clipboard';

export const MeasurementValueGetter = (
    data: Measurement | GridRowModel | null
) => {
    const skjema = (skjemaer: Skjema[]): string => {
        const skjema = skjemaer.find((s) => s.id === data?.skjema.id);
        if (skjema !== undefined) {
            return `${skjema?.area} - ${skjema?.omrade}` || '';
        }
        return '';
    };
    const mType = (measurementTypes: MeasurementType[] | undefined): string => {
        const type = measurementTypes?.find(
            (mt) => mt.shortName === data?.type
        );

        if (type) {
            if (type.hasPol) {
                return type.longName.replace('#', data?.pol);
            }
            return type.longName;
        }
        return '';
    };

    return { skjema, mType };
};
interface ColumnsProps {
    kontroll: Kontroll | undefined;
    skjemaer: Skjema[];
    deleteMeasurement: (MeasurementId: number) => void;
    edit: (MeasurementId: number) => void;
    measurementTypes: MeasurementType[] | undefined;
}
export const columns = ({
    kontroll,
    skjemaer,
    deleteMeasurement,
    edit,
    measurementTypes
}: ColumnsProps) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                MeasurementValueGetter(params.row).mType(measurementTypes)
        },
        {
            field: 'element',
            headerName: 'Element',
            flex: 1
        },
        {
            field: 'resultat',
            headerName: 'Resultat',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.resultat !== undefined && params.row.resultat > 0
                    ? params.row.resultat / 100
                    : ''
        },
        {
            field: 'enhet',
            headerName: 'Enhet',
            flex: 1
        },
        {
            field: 'min',
            headerName: 'Min',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.min !== undefined && params.row.min > 0
                    ? params.row.min / 100
                    : ''
        },
        {
            field: 'maks',
            headerName: 'Maks',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.maks !== undefined && params.row.maks > 0
                    ? params.row.maks / 100
                    : ''
        },
        {
            field: 'kontroll',
            headerName: 'Kontroll',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                kontroll?.name || '',
            sortComparator: (v1, v2, param1, param2) =>
                String(kontroll?.name || '').localeCompare(
                    String(kontroll?.name || '')
                )
        },
        {
            field: 'skjema',
            headerName: 'Skjema',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                MeasurementValueGetter(params.row).skjema(skjemaer),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    MeasurementValueGetter(param1.api.getRow(param1.id)).skjema(
                        skjemaer
                    )
                ).localeCompare(
                    String(
                        MeasurementValueGetter(
                            param2.api.getRow(param2.id)
                        ).skjema(skjemaer)
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
    onSelected: (ids: number[]) => void;
    leftAction?: React.ReactNode;
    isLoading: boolean;
}
export const MeasurementTable = ({
    measurements,
    onSelected,
    leftAction,
    isLoading
}: MeasurementTableProps) => {
    const {
        state: { measurementClipboard }
    } = useClipBoard();
    const getRowStyling = (row: GridRowModel): RowStylingEnum | undefined => {
        if (measurementClipboard?.find((mc) => mc.id === row.id)) {
            return RowStylingEnum.cut;
        }
    };
    return (
        <BaseTable
            onSelected={onSelected}
            getRowStyling={getRowStyling}
            loading={isLoading}
            data={measurements}>
            {leftAction}
        </BaseTable>
    );
};
