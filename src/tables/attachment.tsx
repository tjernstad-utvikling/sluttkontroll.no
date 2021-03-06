import { GridCellParams, GridColDef } from '@mui/x-data-grid-pro';
import React, { useEffect, useState } from 'react';

import { Attachment } from '../contracts/attachmentApi';
import { BaseTable } from './base/defaultTable';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { RowAction } from './base/tableUtils';

interface ColumnsOptions {
    onDelete?: (id: number) => void;
    openFile?: (id: number) => void;
    skipActions?: boolean;
}
export const columns = ({
    onDelete,
    skipActions,
    openFile
}: ColumnsOptions) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Filnavn',
            flex: 1,
            renderCell: (params: GridCellParams) => {
                if (!skipActions) {
                    return (
                        <Button
                            onClick={() => {
                                if (openFile) openFile(params.row.id);
                            }}>
                            {params.row.name}
                        </Button>
                    );
                }
                return <span>{params.row.name}</span>;
            }
        },
        {
            field: 'description',
            headerName: 'Beskrivelse',
            flex: 1
        },
        {
            field: 'action',
            headerName: ' ',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                if (!skipActions) {
                    return (
                        <RowAction
                            actionItems={[
                                {
                                    name: 'Åpne fil',
                                    action: () => {
                                        if (openFile) openFile(params.row.id);
                                    },
                                    icon: <FileOpenIcon />
                                },
                                {
                                    name: 'Slett',
                                    action: () => {
                                        if (onDelete) onDelete(params.row.id);
                                    },
                                    icon: <DeleteForeverIcon />
                                }
                            ]}
                        />
                    );
                }
                return <div />;
            }
        }
    ];

    return columns;
};

export const defaultColumns: string[] = ['id', 'name', 'description'];

interface AttachmentTableProps {
    attachments: Attachment[];
    selectedAttachments?: Attachment[] | undefined;

    isLoading?: boolean;
    onSelected?: (ids: number[]) => void;
    leftAction?: React.ReactNode;
}
export const AttachmentTable = ({
    attachments,
    selectedAttachments,
    isLoading,
    onSelected,
    leftAction
}: AttachmentTableProps) => {
    const [selectionModel, setSelection] = useState<number[]>([]);

    useEffect(() => {
        if (selectedAttachments !== undefined) {
            setSelection(selectedAttachments.map((a) => a.id));
        }
    }, [selectedAttachments]);

    function onSelection(checkpoints: number[]) {
        setSelection(checkpoints);

        if (onSelected) onSelected(checkpoints);
    }
    return (
        <BaseTable
            selectionModel={selectionModel}
            onSelected={onSelection}
            loading={isLoading}
            data={attachments}>
            {leftAction}
        </BaseTable>
    );
};
