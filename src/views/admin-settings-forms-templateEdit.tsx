import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { Card, CardContent } from '../components/card';
import { ColorlibConnector, ColorlibStepIconRoot } from '../components/stepper';
import {
    DraggableComponent,
    DroppableComponent
} from '../components/droppable';
import { FormsFieldTypeEnum, FormsObjectChoice } from '../contracts/formsApi';
import React, { useEffect } from 'react';

import { AdminFormsTemplateEditViewParams } from '../contracts/navigation';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import { DropResult } from 'react-beautiful-dnd';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormsTemplateFieldSchema } from '../schema/formsTemplateField';
import { FormsTemplateGroupSchema } from '../schema/formsTemplateGroup';
import { FormsTemplateSchema } from '../schema/formsTemplate';
import Grid from '@mui/material/Grid';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Step from '@mui/material/Step';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Switch from '@mui/material/Switch';
import TitleIcon from '@mui/icons-material/Title';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useCreateForm } from '../components/forms';
import { useForms } from '../data/forms';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router';

const FormsTemplateNewView = () => {
    const { classes } = usePageStyles();

    const {
        activeStep,
        setActiveStep,
        setCreatedTemplate,
        createdTemplate,
        selectedGroup,
        setSelectedGroup,
        selectedField,
        setSelectedField
    } = useCreateForm();

    const {
        state: { templates },
        editTemplate,
        newTemplateGroup,
        editTemplateGroup,
        newTemplateField,
        editTemplateField
    } = useForms();

    const { templateId } = useParams<AdminFormsTemplateEditViewParams>();

    useEffect(() => {
        if (!createdTemplate) {
            const t = templates?.find((t) => t.id === Number(templateId));
            if (t) setCreatedTemplate(t);
        }
    }, [createdTemplate, setCreatedTemplate, templateId, templates]);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleForward = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const onSaveTemplate = async (
        title: string,
        subTitle: string,
        description: string
    ) => {
        if (createdTemplate) {
            const template = await editTemplate({
                ...createdTemplate,
                title,
                subTitle,
                description
            });
            if (template) {
                setCreatedTemplate(template);
                setActiveStep(1);
                return true;
            }
        }
        return false;
    };

    const onSaveGroup = async (
        title: string,
        description: string,
        showGroupTitle: boolean
    ) => {
        if (selectedGroup) {
            if (
                await editTemplateGroup({
                    ...selectedGroup,
                    title,
                    description,
                    showGroupTitle
                })
            ) {
                setSelectedGroup(undefined);
                return true;
            }
        } else {
            if (createdTemplate !== undefined) {
                if (
                    await newTemplateGroup(
                        title,
                        description,
                        showGroupTitle,
                        createdTemplate.id
                    )
                )
                    return true;
            }
        }
        return false;
    };

    const onSaveField = async (
        title: string,
        type: FormsFieldTypeEnum,
        textChoices: string[] | undefined,
        objectChoices: FormsObjectChoice[] | undefined,
        objectTitle: string | undefined
    ) => {
        if (selectedField) {
            if (
                await editTemplateField({
                    ...selectedField,
                    title,
                    type,
                    textChoices,
                    objectChoices,
                    objectTitle
                })
            ) {
                setSelectedField(undefined);
                return true;
            }
        } else {
            if (selectedGroup !== undefined) {
                if (
                    await newTemplateField(
                        title,
                        type,
                        textChoices,
                        objectChoices,
                        objectTitle,
                        0,
                        selectedGroup.id
                    )
                )
                    return true;
            }
        }
        return false;
    };

    const formSwitch = () => {
        switch (activeStep) {
            case 0:
                return (
                    <FormsTemplateSchema
                        template={createdTemplate}
                        onSubmit={onSaveTemplate}
                        goForward={handleForward}
                    />
                );
            case 1:
                return (
                    <>
                        <FormsTemplateGroupSchema
                            group={selectedGroup}
                            onSubmit={onSaveGroup}
                            goBack={handleBack}
                        />

                        <GroupTable />
                    </>
                );
            case 2:
                return (
                    <>
                        <FormsTemplateFieldSchema
                            field={selectedField}
                            onSubmit={onSaveField}
                            goBack={handleBack}
                        />

                        <FieldTable />
                    </>
                );
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny mal">
                            <CardContent>
                                <Stepper
                                    alternativeLabel
                                    activeStep={activeStep}
                                    connector={<ColorlibConnector />}>
                                    <Step>
                                        <StepLabel
                                            StepIconComponent={
                                                ColorlibStepIcon
                                            }>
                                            Mal
                                            <br />
                                            <Chip
                                                label={`Mal: ${
                                                    createdTemplate?.title || ''
                                                }`}
                                            />
                                        </StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel
                                            StepIconComponent={
                                                ColorlibStepIcon
                                            }>
                                            Grupper
                                            <br />
                                            <Chip
                                                label={`Gruppe: ${
                                                    selectedGroup?.title || ''
                                                }`}
                                            />
                                        </StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel
                                            StepIconComponent={
                                                ColorlibStepIcon
                                            }>
                                            Felter
                                            <br />
                                            <Chip
                                                label={`Felt: ${
                                                    selectedField?.title || ''
                                                }`}
                                            />
                                        </StepLabel>
                                    </Step>
                                </Stepper>
                                {formSwitch()}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default FormsTemplateNewView;

const GroupTable = () => {
    const {
        state: { groups },
        sortGroup
    } = useForms();

    const { createdTemplate, setSelectedGroup, setActiveStep } =
        useCreateForm();

    function onDragEnd(result: DropResult) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const selectedGroups = groups?.filter(
            (g) => g.template.id === createdTemplate?.id
        );
        if (selectedGroups) {
            sortGroup(
                selectedGroups,
                result.source.index,
                result.destination.index
            );
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tittel</TableCell>
                        <TableCell>Vis gruppetittel</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody component={DroppableComponent(onDragEnd)}>
                    {groups
                        ?.filter((g) => g.template.id === createdTemplate?.id)
                        .sort((a, b) => a.sortingIndex - b.sortingIndex)
                        .map((group, index) => (
                            <TableRow
                                component={DraggableComponent(group.id, index)}
                                key={group.id}>
                                <TableCell scope="row">{group.id}</TableCell>
                                <TableCell>{group.title}</TableCell>
                                <TableCell>
                                    {group.showGroupTitle ? (
                                        <VisibilityIcon />
                                    ) : (
                                        <VisibilityOffIcon />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup>
                                        <Button
                                            onClick={() =>
                                                setSelectedGroup(group)
                                            }
                                            variant="contained"
                                            color="primary">
                                            Rediger
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setSelectedGroup(group);
                                                setActiveStep(2);
                                            }}
                                            variant="contained"
                                            color="primary">
                                            Velg
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
const FieldTable = () => {
    const {
        state: { fields },
        sortFields,
        setIdentification
    } = useForms();

    const {
        selectedGroup,
        setSelectedField,
        createdTemplate,
        setCreatedTemplate
    } = useCreateForm();

    const handleSetListIdentificationField = async (fieldId: number) => {
        if (createdTemplate !== undefined) {
            const template = await setIdentification(createdTemplate, fieldId);
            if (template) setCreatedTemplate(template);
        }
    };

    function onDragEnd(result: DropResult) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const selectedFields = fields?.filter(
            (f) => f.sjaGroup.id === selectedGroup?.id
        );
        if (selectedFields) {
            sortFields(
                selectedFields,
                result.source.index,
                result.destination.index
            );
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tittel</TableCell>
                        <TableCell>Felt type</TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody component={DroppableComponent(onDragEnd)}>
                    {fields
                        ?.filter((f) => f.sjaGroup.id === selectedGroup?.id)
                        .sort((a, b) => a.sortingIndex - b.sortingIndex)
                        .map((field, index) => (
                            <TableRow
                                component={DraggableComponent(field.id, index)}
                                key={field.id}>
                                <TableCell scope="row">{field.id}</TableCell>
                                <TableCell>{field.title}</TableCell>
                                <TableCell>{field.type}</TableCell>
                                <TableCell>
                                    {field.type === FormsFieldTypeEnum.info && (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={
                                                        createdTemplate
                                                            ?.listIdentificationField
                                                            ?.id === field.id
                                                    }
                                                    onChange={() =>
                                                        handleSetListIdentificationField(
                                                            field.id
                                                        )
                                                    }
                                                />
                                            }
                                            label="Felt for identifisering av utfylt skjema"
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        onClick={() => setSelectedField(field)}
                                        variant="contained"
                                        color="primary">
                                        Rediger
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <TitleIcon />,
        2: <BrandingWatermarkIcon />,
        3: <PlaylistAddCheckIcon />
    };

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active }}
            className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}
