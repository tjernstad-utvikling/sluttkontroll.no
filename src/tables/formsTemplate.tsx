import { GridCellParams, GridColDef, GridRowData } from '@mui/x-data-grid-pro';

import { BaseTable } from './baseTable';
import EditIcon from '@mui/icons-material/Edit';
import { FormsTemplate } from '../contracts/formsApi';
import { RowAction } from './tableUtils';
import { Template } from '../contracts/skjemaTemplateApi';

export const TemplateValueGetter = (data: Template | GridRowData) => {
    const count = (): string => {
        return data.skjemaTemplateCheckpoints.length;
    };

    return { count };
};

interface ColumnsParams {
    path: string;
}
export const columns = ({ path }: ColumnsParams) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            width: 100
        },
        {
            field: 'title',
            headerName: 'Tittel',
            flex: 1
        },
        {
            field: 'subTitle',
            headerName: 'Under tittel',
            flex: 1
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
                                to: `${path}/${params.row.id}`,
                                icon: <EditIcon />
                            }
                        ]}
                    />
                );
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['id', 'title', 'subTitle'];

interface TemplateTableProps {
    templates: FormsTemplate[];
}
export const FormsTemplateTable = ({ templates }: TemplateTableProps) => {
    return <BaseTable data={templates} />;
};
