import { Column, Row } from 'react-table';

import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import EditIcon from '@mui/icons-material/Edit';
import { GroupTable } from './base/groupTable';
import { RouterButton } from '../components/button';
import { SkjemaTemplateCheckpoint } from '../contracts/skjemaTemplateApi';
import { TableKey } from '../contracts/keys';
import { useMemo } from 'react';

type Columns = {
    id: number;
    prosedyreNr: string;
    prosedyre: string;
    gruppe: string;
    action: number;
};

interface CheckpointTableProps {
    checkpoints: Checkpoint[];
    checklists?: Checklist[];
    templateList?: SkjemaTemplateCheckpoint[];
    editCheckpoint?: boolean;

    onSelected?: (ids: number[]) => void;
    children?: React.ReactNode;
    isLoading: boolean;
}
export const CheckpointTable = ({
    checkpoints,
    checklists,
    templateList,
    editCheckpoint,

    onSelected,
    children,
    isLoading
}: CheckpointTableProps) => {
    const data = useMemo((): Columns[] => {
        return checkpoints.map((c) => {
            return {
                ...c,
                action: c.id
            };
        });
    }, [checkpoints]);

    const selectedIds = useMemo(() => {
        if (templateList !== undefined) {
            return templateList.map((tl) => tl.checkpoint.id);
        }
        if (checklists !== undefined) {
            return checklists.map((cl) => cl.checkpoint.id);
        }
        return [];
    }, [checklists, templateList]);

    function updateSelected(rows: Row<Columns>[]) {
        if (onSelected) onSelected(rows.map((r) => r.values.id));
    }

    const columns: Column<Columns>[] = useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id',
                disableGroupBy: true
            },
            {
                Header: 'Prosedyre nr',
                accessor: 'prosedyreNr',
                disableGroupBy: true
            },
            {
                Header: 'Prosedyre',
                accessor: 'prosedyre',
                disableGroupBy: true
            },
            {
                Header: 'Gruppe',
                accessor: 'gruppe',
                disableGroupBy: false
            },
            {
                Header: '',
                accessor: 'action',
                disableGroupBy: true
            }
        ],
        []
    );

    const getAction = (row: Row<Columns>) => (
        <>
            {editCheckpoint ? (
                <RouterButton
                    to={`/admin/settings/checkpoint/${
                        row.cells.find((c) => c.column.id === 'id')?.value
                    }`}
                    color="primary"
                    startIcon={<EditIcon />}>
                    rediger
                </RouterButton>
            ) : (
                <div />
            )}
        </>
    );

    return (
        <GroupTable<Columns>
            tableKey={TableKey.checkpoint}
            columns={columns}
            data={data}
            defaultGroupBy={['gruppe']}
            toRenderInCustomCell={[]}
            getAction={getAction}
            isLoading={isLoading}
            selectedIds={selectedIds}
            setSelected={updateSelected}
            preserveSelected
        />
    );
};
