import { GridCellParams, GridColDef } from '@mui/x-data-grid-pro';

import { BaseTable } from './baseTable';
import Button from '@mui/material/Button';
import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import EditIcon from '@mui/icons-material/Edit';
import { SkjemaTemplateCheckpoint } from '../contracts/skjemaTemplateApi';
import { useMemo } from 'react';

interface ColumnsParams {
    editCheckpoint?: boolean;
    onEditCheckpoint?: (checkpointId: number) => void;
}
export const columns = ({
    editCheckpoint,
    onEditCheckpoint
}: ColumnsParams) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'id',
            width: 100
        },
        {
            field: 'prosedyreNr',
            headerName: '#',
            width: 120
        },
        {
            field: 'prosedyre',
            headerName: 'Prosedyre',
            flex: 1
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                if (editCheckpoint && onEditCheckpoint !== undefined) {
                    return (
                        <Button
                            onClick={() => onEditCheckpoint(params.row.id)}
                            color="primary"
                            startIcon={<EditIcon />}>
                            {params.row.name}
                        </Button>
                    );
                }
                return <div />;
            }
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['prosedyreNr', 'prosedyre'];

interface CheckpointTableProps {
    checkpoints: Checkpoint[];
    checklists?: Checklist[];
    templateList?: SkjemaTemplateCheckpoint[];
    onSelected?: (checkpoints: number[]) => void;
}
export const CheckpointTable = ({
    checkpoints,
    checklists,
    templateList,
    onSelected
}: CheckpointTableProps) => {
    const selectionModel = useMemo(() => {
        if (checklists !== undefined) {
            return checklists.map((cl) => cl.checkpoint.id);
        }
        if (templateList !== undefined) {
            return templateList.map((tl) => tl.checkpoint.id);
        }
    }, [checklists, templateList]);

    return (
        <BaseTable
            selectionModel={selectionModel}
            onSelected={onSelected}
            data={checkpoints}
        />
    );
};
