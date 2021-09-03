import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridValueGetterParams
} from '@material-ui/data-grid';

import { BaseTable } from './baseTable';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
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
    deleteTemplate: (templateId: number) => void;
}
export const columns = ({ path, deleteTemplate }: ColumnsParams) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Navn',
            flex: 1
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
                                action: () => deleteTemplate(params.row.id),
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
