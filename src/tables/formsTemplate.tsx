import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { BaseTable } from './baseTable';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { RowAction } from './tableUtils';
import { Template } from '../contracts/skjemaTemplateApi';
import { Typography } from '@mui/material';

export const TemplateValueGetter = (data: Template | GridRowData) => {
    const count = (): string => {
        return data.skjemaTemplateCheckpoints.length;
    };

    return { count };
};

interface ColumnsParams {
    path?: string;
    deleteTemplate?: (templateId: number) => void;
    onSelectTemplate?: (templateId: number) => void;
    selectTemplate?: boolean;
}
export const columns = ({
    path,
    deleteTemplate,
    selectTemplate,
    onSelectTemplate
}: ColumnsParams) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Navn',
            flex: 1,
            renderCell: (params: GridCellParams) => {
                if (selectTemplate && onSelectTemplate !== undefined) {
                    return (
                        <Button
                            onClick={() => onSelectTemplate(params.row.id)}
                            color="primary"
                            startIcon={<AddShoppingCartIcon />}>
                            {params.row.name}
                        </Button>
                    );
                }
                return <Typography>{params.row.name}</Typography>;
            }
        },
        {
            field: 'count',
            headerName: 'Antall punkter',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                TemplateValueGetter(params.row).count()
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                if (!selectTemplate) {
                    return (
                        <RowAction
                            actionItems={[
                                {
                                    name: 'Rediger',
                                    to: `${path}/${params.row.id}`,
                                    icon: <EditIcon />
                                },
                                {
                                    name: 'Slett',
                                    action: () => {
                                        if (deleteTemplate !== undefined)
                                            deleteTemplate(params.row.id);
                                    },
                                    icon: <DeleteForeverIcon />
                                }
                            ]}
                        />
                    );
                }
                return <div />;
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['id', 'title', 'subTitle'];

interface TemplateTableProps {
    templates: Template[];
}
export const FormsTemplateTable = ({ templates }: TemplateTableProps) => {
    function CustomSort<T extends keyof Template>(
        data: Template[],
        field: T
    ): Template[] {
        switch (field.toString()) {
            case 'count':
                return data
                    .slice()
                    .sort((a, b) =>
                        String(TemplateValueGetter(a).count()).localeCompare(
                            String(TemplateValueGetter(b).count()),
                            undefined,
                            { numeric: true, sensitivity: 'base' }
                        )
                    );
            default:
                return data;
        }
    }

    return (
        <BaseTable
            data={templates}
            customSort={CustomSort}
            customSortFields={['count']}
        />
    );
};
