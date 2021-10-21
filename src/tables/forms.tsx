import { FilledField, Forms } from '../contracts/formsApi';
import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import { BaseTable } from './baseTable';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import { format } from 'date-fns';

export const ValueGetter = (data: Forms | GridRowData) => {
    const skjema = (): string => {
        return (
            data.sjaFormFields.find(
                (f: FilledField) =>
                    f.field.id === data.template.listIdentificationField?.id
            )?.text || ''
        );
    };
    const date = (dateFormat: string): string => {
        const date = data.sjaFormFields.find(
            (f: FilledField) => f.field.id === data.template.listDateField?.id
        )?.date;
        return (date && format(new Date(date), dateFormat)) || '';
    };
    const title = (): string => {
        return data.template.title;
    };
    const subTitle = (): string => {
        return data.template.subTitle;
    };
    const user = (): string => {
        return data.user.name;
    };

    return { skjema, title, subTitle, user, date };
};

interface ColumnsParams {
    onDownloadForm: (formId: number) => void;
}
export const columns = ({ onDownloadForm }: ColumnsParams) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            width: 100
        },
        {
            field: 'skjema',
            headerName: 'Skjema',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).skjema(),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    ValueGetter(param1.api.getRow(param1.id)).skjema()
                ).localeCompare(
                    String(ValueGetter(param2.api.getRow(param2.id)).skjema())
                )
        },
        {
            field: 'date',
            headerName: 'Signert dato',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).date('dd.MM.Y'),
            sortComparator: (v1, v2, param1, param2) =>
                ValueGetter(param1.api.getRow(param1.id))
                    .date('Y-MM-dd')
                    .localeCompare(
                        ValueGetter(param2.api.getRow(param2.id)).date(
                            'Y-MM-dd'
                        )
                    )
        },
        {
            field: 'user',
            headerName: 'Bruker',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).user(),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    ValueGetter(param1.api.getRow(param1.id)).user()
                ).localeCompare(
                    String(ValueGetter(param2.api.getRow(param2.id)).user())
                )
        },
        {
            field: 'title',
            headerName: 'Tittel',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).title(),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    ValueGetter(param1.api.getRow(param1.id)).title()
                ).localeCompare(
                    String(ValueGetter(param2.api.getRow(param2.id)).title())
                )
        },
        {
            field: 'subTitle',
            headerName: 'Under tittel',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).subTitle(),
            sortComparator: (v1, v2, param1, param2) =>
                String(
                    ValueGetter(param1.api.getRow(param1.id)).subTitle()
                ).localeCompare(
                    String(ValueGetter(param2.api.getRow(param2.id)).subTitle())
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
                    <IconButton
                        onClick={() => onDownloadForm(params.row.id)}
                        aria-label="Last ned skjema">
                        <PrintIcon />
                    </IconButton>
                );
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['id', 'skjema', 'title'];

interface FormsTableProps {
    forms: Forms[];
}
export const FormsTable = ({ forms }: FormsTableProps) => {
    return <BaseTable data={forms} />;
};
