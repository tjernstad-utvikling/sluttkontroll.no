import {
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid-pro';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { BaseTable } from './base/baseTable';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { RowAction } from './base/tableUtils';
import { Template } from '../contracts/skjemaTemplateApi';
import { Typography } from '@mui/material';

export const TemplateValueGetter = (data: Template | GridRowModel | null) => {
    const count = (): string => {
        return data?.skjemaTemplateCheckpoints.length;
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
                TemplateValueGetter(params.row).count(),

            sortComparator: (v1, v2, param1, param2) =>
                String(
                    TemplateValueGetter(param1.api.getRow(param1.id)).count()
                ).localeCompare(
                    String(
                        TemplateValueGetter(
                            param2.api.getRow(param2.id)
                        ).count()
                    ),
                    undefined,
                    { numeric: true, sensitivity: 'base' }
                )
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

export const defaultColumns: Array<string> = ['id', 'name', 'count'];

interface TemplateTableProps {
    templates: Template[];
}
export const TemplateTable = ({ templates }: TemplateTableProps) => {
    return <BaseTable data={templates} />;
};
