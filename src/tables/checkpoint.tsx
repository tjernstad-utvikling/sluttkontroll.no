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
};

interface CheckpointTableProps {
    checkpoints: Checkpoint[];
    checklists?: Checklist[];
    templateList?: SkjemaTemplateCheckpoint[];
    editCheckpoint?: boolean;
    enableSelection?: boolean;
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
    enableSelection,
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
        if (onSelected) onSelected(rows.map((r) => r.getValue('id')));
    }

    const columns: ColumnDef<Columns>[] = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'id',
                enableGrouping: false
            },
            {
                header: 'Prosedyre nr',
                accessorKey: 'prosedyreNr',
                enableGrouping: false
            },
            {
                header: 'Prosedyre',
                accessorKey: 'prosedyre',
                enableGrouping: false
            },
            {
                header: 'Kategori',
                accessorKey: 'mainCategory',
                enableGrouping: true
            },
            {
                header: 'Gruppe',
                accessorKey: 'groupCategory',
                enableGrouping: true
            },
            {
                id: 'actions',
                header: '',
                enableGrouping: false,
                cell: ({ row }) => (
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
                            <div>Test</div>
                        )}
                    </>
                )
            }
        ],
        [editCheckpoint]
    );

    return (
        <GroupTable<Columns>
            tableKey={TableKey.checkpoint}
            columns={columns}
            data={data}
            defaultGrouping={['mainCategory', 'groupCategory']}
            defaultVisibilityState={{}}
            toRenderInCustomCell={[]}
            isLoading={isLoading}
            selectedIds={selectedIds}
            setSelected={updateSelected}
            preserveSelected
            enableSelection={enableSelection}
        />
    );
};
