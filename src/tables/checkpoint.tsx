import { GridColDef, GridRowData, GridRowId } from '@material-ui/data-grid';
import { useEffect, useMemo } from 'react';

import { BaseTable } from './baseTable';
import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import { SkjemaTemplateCheckpoint } from '../contracts/skjemaTemplateApi';
import { useTable } from './tableContainer';

export const columns = (url: string) => {
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
        }
    ];

    return columns;
};

export const defaultColumns: Array<string> = ['prosedyreNr', 'prosedyre'];

interface CheckpointTableProps {
    checkpoints: Checkpoint[];
    checklists?: Checklist[];
    templateList?: SkjemaTemplateCheckpoint[];
    skjemaId?: number;
    onSelected: (checkpoints: Checkpoint[]) => void;
}
export const CheckpointTable = ({
    checkpoints,
    checklists,
    skjemaId,
    templateList,
    onSelected
}: CheckpointTableProps) => {
    const { apiRef } = useTable();

    const selectionModel = useMemo(() => {
        if (checklists !== undefined) {
            return checklists.map((cl) => cl.checkpoint.id);
        }
    }, [checklists]);

    useEffect(() => {
        if (
            checklists !== undefined &&
            skjemaId !== undefined &&
            apiRef.current !== null &&
            checkpoints.length > 0
        ) {
            const selectArray = checklists.map((cl) => cl.checkpoint.id);
            apiRef.current.selectRows(selectArray);
        }
    }, [apiRef, checklists, checkpoints.length, skjemaId]);

    useEffect(() => {
        if (
            templateList !== undefined &&
            apiRef.current !== null &&
            checkpoints.length > 0
        ) {
            const selectArray = templateList.map((tl) => tl.checkpoint.id);
            apiRef.current.selectRows(selectArray);
        }
    }, [apiRef, checkpoints.length, templateList]);

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
        onSelected(cpRows);
    };

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
