import { GridColDef, GridRowData, GridRowId } from '@material-ui/data-grid';

import { BaseTable } from './baseTable';
import { Checkpoint } from '../contracts/checkpointApi';
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
    checkpoints: Array<Checkpoint>;
    onSelected: (checkpoints: Array<Checkpoint>) => void;
}
export const CheckpointTable = ({
    checkpoints,
    onSelected
}: CheckpointTableProps) => {
    const { apiRef } = useTable();
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
            onSelected={onSelect}
            data={checkpoints}
            customSort={CustomSort}
        />
    );
};
