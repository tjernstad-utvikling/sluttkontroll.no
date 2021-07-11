import { BaseTable } from './baseTable';
import { Checkpoint } from '../contracts/checkpointApi';
import { GridColDef } from '@material-ui/data-grid';

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
}
export const CheckpointTable = ({ checkpoints }: CheckpointTableProps) => {
    function CustomSort<T extends keyof Checkpoint>(
        data: Checkpoint[],
        field: T
    ): Checkpoint[] {
        switch (field.toString()) {
            default:
                return data;
        }
    }

    return <BaseTable data={checkpoints} customSort={CustomSort} />;
};
