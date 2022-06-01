import { BaseTable, RowStylingEnum } from './base/defaultTable';
import { Column, Row } from 'react-table';
import { useEffect, useMemo, useState } from 'react';

import Button from '@mui/material/Button';
import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import EditIcon from '@mui/icons-material/Edit';
import { GroupTable } from './base/groupTable';
import { RowAction } from './base/tableUtils';
import { SkjemaTemplateCheckpoint } from '../contracts/skjemaTemplateApi';
import { TableKey } from '../contracts/keys';

type Columns = {
    id: number;
    prosedyreNr: string;
    prosedyre: string;
    gruppe: string;
    action: number;
};

interface CheckpointTableProps {
    checkpoints: Checkpoint[];
    checklists: Checklist[];
    editCheckpoint?: boolean;
    onEditCheckpoint?: (checkpointId: number) => void;
    children?: React.ReactNode;
    isLoading: boolean;
}
export const CheckpointTable = ({
    checkpoints,
    checklists,
    editCheckpoint,
    onEditCheckpoint,
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

    const [selectedData, setSelectedData] = useState<Columns[]>([]);

    useEffect(() => {
        if (checklists !== undefined) {
            setSelectedData(
                data.filter((d) =>
                    checklists.map((cl) => cl.checkpoint.id === d.id)
                )
            );
        }
        // if (templateList !== undefined) {
        //     setSelection(templateList.map((tl) => tl.checkpoint.id));
        // }
    }, [checklists, data]);

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
            {editCheckpoint && onEditCheckpoint !== undefined ? (
                <Button
                    onClick={() =>
                        onEditCheckpoint(
                            Number(
                                row.cells.find((c) => c.column.id === 'id')
                                    ?.value
                            )
                        )
                    }
                    color="primary"
                    startIcon={<EditIcon />}>
                    rediger
                </Button>
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
            selectedRows={selectedData}
            setSelectedRows={setSelectedData}
        />
    );
};
