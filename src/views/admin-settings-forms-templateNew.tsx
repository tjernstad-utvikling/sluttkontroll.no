import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
    ResponderProvided
} from 'react-beautiful-dnd';
import { FormsGroup, FormsTemplate } from '../contracts/sjaApi';
import React, { useState } from 'react';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import { FormsTemplateGroupSchema } from '../schema/formsTemplateGroup';
import { FormsTemplateSchema } from '../schema/formsTemplate';
import Grid from '@material-ui/core/Grid';
import { useForms } from '../data/forms';
import { usePageStyles } from '../styles/kontroll/page';

const FormsTemplateNewView = () => {
    const classes = usePageStyles();

    const [template, setTemplate] = useState<FormsTemplate>();
    const [group, setGroup] = useState<FormsGroup>();

    const {
        state: { groups }
    } = useForms();

    const onSave = async (
        title: string,
        subTitle: string,
        description: string
    ) => {
        return false;
    };
    const onSaveGroup = async (title: string, description: string) => {
        return false;
    };
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny skjema mal">
                            <FormsTemplateSchema onSubmit={onSave} />
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Grupper">
                            <FormsTemplateGroupSchema onSubmit={onSaveGroup} />
                            {groups !== undefined ? (
                                <GroupTable groups={groups} />
                            ) : (
                                <p>Ingen grupper registrert</p>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default FormsTemplateNewView;

interface GroupTableProps {
    groups: FormsGroup[];
}

const GroupTable = ({ groups }: GroupTableProps) => {
    function onDragEnd(result: DropResult) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        console.log(
            `dragEnd ${result.source.index} to  ${result.destination.index}`
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tittel</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody component={DroppableComponent(onDragEnd)}>
                    {groups.map((group, index) => (
                        <TableRow
                            component={DraggableComponent(group.id, index)}
                            key={group.id}>
                            <TableCell scope="row">{group.id}</TableCell>
                            <TableCell>{group.title}</TableCell>
                            <TableCell align="right">
                                <Button />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const DraggableComponent =
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
const DroppableComponent =
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
