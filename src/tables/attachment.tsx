import React, { useEffect, useState } from 'react';

import { Attachment } from '../contracts/attachmentApi';
import { BaseTable } from './baseTable';
import { GridColDef } from '@mui/x-data-grid-pro';

export const columns = () => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Filnavn',
            flex: 1
        },
        {
            field: 'description',
            headerName: 'Beskrivelse',
            flex: 1
        }
    ];

    return columns;
};

export const defaultColumns: string[] = ['id', 'name', 'description'];

interface AttachmentTableProps {
    attachments: Attachment[];
    selectedAttachments: Attachment[] | undefined;

    onSelected: (ids: number[]) => void;
    leftAction?: React.ReactNode;
}
export const AttachmentTable = ({
    attachments,
    selectedAttachments,
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
            data={attachments}>
            {leftAction}
        </BaseTable>
    );
};
