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
import { makeStyles, withStyles } from '@material-ui/core/styles';

import BrandingWatermarkIcon from '@material-ui/icons/BrandingWatermark';
import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import { FormsTemplateGroupSchema } from '../schema/formsTemplateGroup';
import { FormsTemplateSchema } from '../schema/formsTemplate';
import Grid from '@material-ui/core/Grid';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import React from 'react';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import TitleIcon from '@material-ui/icons/Title';
import clsx from 'clsx';
import { useForms } from '../data/forms';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const FormsTemplateNewView = () => {
    const classes = usePageStyles();

    const [template, setTemplate] = useState<FormsTemplate>();
    const [group, setGroup] = useState<FormsGroup>();

    const [activeStep, setActiveStep] = useState(0);

    const {
        state: { groups },
        newTemplate,
        newTemplateGroup
    } = useForms();

    const onSaveTemplate = async (
        title: string,
        subTitle: string,
        description: string
    ) => {
        const template = await newTemplate(title, subTitle, description);

        if (template) {
            setTemplate(template);
            setActiveStep(1);
        }
        return false;
    };

    const onSaveGroup = async (title: string, description: string) => {
        if (template !== undefined) {
            if (await newTemplateGroup(title, description, template.id))
                return true;
        }
        return false;
    };

    const formSwitch = () => {
        switch (activeStep) {
            case 0:
                return <FormsTemplateSchema onSubmit={onSaveTemplate} />;
            case 1:
                return (
                    <>
                        <FormsTemplateGroupSchema onSubmit={onSaveGroup} />

                        <GroupTable template={template} />
                    </>
                );
            case 2:
                return <div />;
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny mal">
                            <Stepper
                                alternativeLabel
                                activeStep={activeStep}
                                connector={<ColorlibConnector />}>
                                <Step>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}>
                                        Mal
                                        <br />
                                        {template?.title}
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}>
                                        Grupper
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}>
                                        Felter
                                    </StepLabel>
                                </Step>
                            </Stepper>
                            {formSwitch()}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default FormsTemplateNewView;

interface GroupTableProps {
    template: FormsTemplate | undefined;
}

const GroupTable = ({ template }: GroupTableProps) => {
    const {
        state: { groups },
        sortGroup
    } = useForms();

    function onDragEnd(result: DropResult) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const selectedGroups = groups?.filter(
            (g) => g.template.id === template?.id
        );
        if (selectedGroups) {
            sortGroup(
                selectedGroups,
                result.source.index,
                result.destination.index
            );
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
                    {groups
                        ?.filter((g) => g.template.id === template?.id)
                        .sort((a, b) => a.sortingIndex - b.sortingIndex)
                        .map((group, index) => (
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

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
        }
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%)'
        }
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1
    }
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    active: {
        backgroundImage:
            'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    },
    completed: {
        backgroundImage:
            'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
    }
});

function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <TitleIcon />,
        2: <BrandingWatermarkIcon />,
        3: <PlaylistAddCheckIcon />
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed
            })}>
            {icons[String(props.icon)]}
        </div>
    );
}
