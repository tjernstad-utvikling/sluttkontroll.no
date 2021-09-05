import {
    GridCellParams,
    GridColDef,
    GridRowData,
    GridRowId
} from '@material-ui/data-grid';

import { BaseTable } from './baseTable';
import Button from '@material-ui/core/Button';
import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import EditIcon from '@material-ui/icons/Edit';
import { SkjemaTemplateCheckpoint } from '../contracts/skjemaTemplateApi';
import { useMemo } from 'react';
import { useTable } from './tableContainer';

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
    onSelected?: (checkpoints: Checkpoint[]) => void;
}
export const CheckpointTable = ({
    checkpoints,
    checklists,
    templateList,
    onSelected
}: CheckpointTableProps) => {
    const { apiRef } = useTable();

    const selectionModel = useMemo(() => {
        if (checklists !== undefined) {
            return checklists.map((cl) => cl.checkpoint.id);
        }
        if (templateList !== undefined) {
            return templateList.map((tl) => tl.checkpoint.id);
        }
    }, [checklists, templateList]);

    function CustomSort<T extends keyof Checkpoint>(
        data: Checkpoint[],
        field: T
    ): Checkpoint[] {
        switch (field.toString()) {
            default:
                return data;
        }
    }
    const onSelect = () => {
        const rows: Map<GridRowId, GridRowData> =
            apiRef.current.getSelectedRows();

        const cpRows: Checkpoint[] = [];

        rows.forEach((r) =>
            cpRows.push({
                gruppe: r.gruppe,
                id: r.id,
                prosedyre: r.prosedyre,
                prosedyreNr: r.prosedyreNr,
                tekst: r.tekst,
                tiltak: r.tiltak
            })
        );
        if (onSelected !== undefined) {
            onSelected(cpRows);
        }
    };
    console.log({ checkpoints });
    return (
        <BaseTable
            selectionModel={selectionModel}
            onSelected={onSelect}
            data={checkpoints}
            customSort={CustomSort}
            customSortFields={[]}
        />
    );
};
