import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { BaseTable } from './baseTable';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { RowAction } from './tableUtils';
import { Template } from '../contracts/skjemaTemplateApi';
import { Typography } from '@material-ui/core';

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
                return (
                    <RowAction
                        actionItems={[
                            {
                                name: 'Rediger',
                                to: `${path}/${params.row.id}`,
                                icon: <EditIcon />
                            },
                            {
                                name: 'Slett (kommer)',
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
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['id', 'name', 'count'];

interface TemplateTableProps {
    templates: Template[];
}
export const TemplateTable = ({ templates }: TemplateTableProps) => {
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
