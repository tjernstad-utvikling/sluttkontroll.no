import { ColumnDef, Row } from '@tanstack/react-table';

import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import EditIcon from '@mui/icons-material/Edit';
import { GroupTable } from './base/groupTable';
import { RouterButton } from '../components/button';
import { SkjemaTemplateCheckpoint } from '../contracts/skjemaTemplateApi';
import { TableKey } from '../contracts/keys';
import { categories } from '../utils/checkpointCategories.json';
import { useMemo } from 'react';

type Columns = {
    id: number;
    prosedyreNr: string;
    prosedyre: string;
    groupCategory: string;
    mainCategory: string;
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
                groupCategory:
                    categories
                        .find((mc) => mc.key === c.mainCategory)
                        ?.groups.find((g) => g.key === c.groupCategory)?.name ??
                    String(c.groupCategory),
                mainCategory:
                    categories.find((mc) => mc.key === c.mainCategory)?.name ??
                    String(c.groupCategory),
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

    const columns: ColumnDef<Columns>[] = useMemo(
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
                Header: 'Kategori',
                accessor: 'mainCategory',
                disableGroupBy: false
            },
            {
                Header: 'Gruppe',
                accessor: 'groupCategory',
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
                    to={`/admin/settings/checkpoint/${row
                        .getAllCells()
                        .find((c) => c.column.id === 'id')
                        ?.getValue()}`}
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
            defaultGrouping={['mainCategory', 'groupCategory']}
            defaultVisibilityState={{}}
            toRenderInCustomCell={[]}
            getAction={getAction}
            isLoading={isLoading}
            selectedIds={selectedIds}
            setSelected={updateSelected}
            preserveSelected
        />
    );
};
