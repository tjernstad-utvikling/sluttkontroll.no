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
    editCheckpoint?: boolean;
    onEditCheckpoint?: (checkpointId: number) => void;
    children?: React.ReactNode;
    isLoading: boolean;
}
export const CheckpointTable = ({
    checkpoints,
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

    const getRowStyling = (row: Row<Columns>): RowStylingEnum | undefined => {
        if (
            !row.allCells.find((c) => c.column.id === 'aktuell')?.value &&
            !row.isGrouped
        ) {
            return RowStylingEnum.disabled;
        }
    };

    return (
        <GroupTable<Columns>
            tableKey={TableKey.checkpoint}
            columns={columns}
            data={data}
            defaultGroupBy={['gruppe']}
            toRenderInCustomCell={[]}
            getAction={getAction}
            getRowStyling={getRowStyling}
            isLoading={isLoading}
        />
    );
};
