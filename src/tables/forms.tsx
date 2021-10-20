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
                ValueGetter(params.row).skjema()
        },
        {
            field: 'date',
            headerName: 'Signert dato',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).date('dd.MM.Y')
        },
        {
            field: 'user',
            headerName: 'Bruker',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).user()
        },
        {
            field: 'title',
            headerName: 'Tittel',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).title()
        },
        {
            field: 'subTitle',
            headerName: 'Under tittel',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                ValueGetter(params.row).subTitle()
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
    function CustomSort<T extends keyof Forms>(
        data: Forms[],
        field: T
    ): Forms[] {
        switch (field.toString()) {
            case 'skjema':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(ValueGetter(a).skjema()).localeCompare(
                            String(ValueGetter(b).skjema())
                        )
                    );
            case 'date':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(ValueGetter(a).skjema()).localeCompare(
                            String(ValueGetter(b).date('Y-MM-dd'))
                        )
                    );
            case 'title':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(ValueGetter(a).title()).localeCompare(
                            String(ValueGetter(b).title())
                        )
                    );
            case 'subTitle':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(ValueGetter(a).subTitle()).localeCompare(
                            String(ValueGetter(b).subTitle())
                        )
                    );
            case 'user':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(ValueGetter(a).user()).localeCompare(
                            String(ValueGetter(b).user())
                        )
                    );
            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={forms}
            customSort={CustomSort}
            customSortFields={['skjema', 'title', 'subTitle', 'user']}
        />
    );
};
