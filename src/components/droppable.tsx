import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
    ResponderProvided
} from 'react-beautiful-dnd';

import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';

export const DraggableComponent =
    (id: number, index: number) => (props: { children: React.ReactNode }) => {
        return (
            <Draggable draggableId={String(id)} index={index}>
                {(provided, snapshot) => (
                    <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        {...props}>
                        {props.children}
                    </TableRow>
                )}
            </Draggable>
        );
    };
export const DroppableComponent =
    (onDragEnd: (result: DropResult, provided: ResponderProvided) => void) =>
    (props: { children: React.ReactNode }) => {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={'1'} direction="vertical">
                    {(provided) => {
                        return (
                            <TableBody
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                {...props}>
                                {props.children}
                                {provided.placeholder}
                            </TableBody>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        );
    };
