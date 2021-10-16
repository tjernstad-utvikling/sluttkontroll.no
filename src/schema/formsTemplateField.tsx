import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import {
    FormsField,
    FormsFieldTypeEnum,
    FormsObjectChoice
} from '../contracts/sjaApi';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiTextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Select from 'react-select';
import { TextField } from '../components/input';
import { useCreateForm } from '../components/forms';
import { useMemo } from 'react';
import { useStyles } from '../theme/makeStyles';
import { v4 as uuidv4 } from 'uuid';

interface PreDefRow {
    id: string;
    text: string;
}
interface preDefObjRow {
    id: string | number;
    text: string;
    title: string;
}
interface Option {
    value: FormsFieldTypeEnum;
    label: string;
}

const formsFieldTypeOption: Option[] = [
    {
        value: FormsFieldTypeEnum.info,
        label: 'Info felt'
    },
    {
        value: FormsFieldTypeEnum.check,
        label: 'Ja/Nei med kommentar'
    },
    {
        value: FormsFieldTypeEnum.preDef,
        label: 'Predefinerte tekster'
    },
    {
        value: FormsFieldTypeEnum.preDefObj,
        label: 'Predefinerte valg med tilhørende tekst'
    },
    {
        value: FormsFieldTypeEnum.signature,
        label: 'Signatur'
    }
];

interface FormValues {
    title: string;
    type: Option | null;
    textChoices: PreDefRow[] | undefined;
    objectChoices: preDefObjRow[] | undefined;
    objectTitle: string;
}

interface FormsTemplateFieldSchemaProps {
    field?: FormsField;
    onSubmit: (
        title: string,
        type: FormsFieldTypeEnum,
        textChoices: string[] | undefined,
        objectChoices: FormsObjectChoice[] | undefined,
        objectTitle: string | undefined
    ) => Promise<boolean>;
    goBack: () => void;
}
export const FormsTemplateFieldSchema = ({
    field,
    onSubmit,
    goBack
}: FormsTemplateFieldSchemaProps): JSX.Element => {
    const { setSelectedField } = useCreateForm();
    const { cx, css, theme } = useStyles();

    const selectedType = useMemo(() => {
        let preSelectedType = FormsFieldTypeEnum.info;
        if (field !== undefined) {
            preSelectedType = field.type;
        }
        const option = formsFieldTypeOption?.find(
            (o) => o.value === preSelectedType
        );
        if (option !== undefined) {
            return option;
        }
        return null;
    }, [field]);

    const setTextChoices = useMemo(() => {
        if (field?.textChoices !== undefined) {
            return field.textChoices.map((t) => ({
                id: uuidv4(),
                text: t
            }));
        } else {
            return [
                {
                    id: uuidv4(),
                    text: ''
                }
            ];
        }
    }, [field]);

    const setObjectChoices = useMemo(() => {
        if (field?.objectChoices !== undefined) {
            return field.objectChoices.map((objC) => ({
                id: objC.id || uuidv4(),
                title: objC.title,
                text: objC.text
            }));
        } else {
            return [
                {
                    id: uuidv4(),
                    text: '',
                    title: ''
                }
            ];
        }
    }, [field]);

    return (
        <Formik
            initialValues={{
                title: field?.title || '',
                type: selectedType,
                textChoices: setTextChoices,
                objectChoices: setObjectChoices,
                objectTitle: field?.objectTitle || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
                title: Yup.string().required('Tittel er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                console.log({ values });
                if (values.type?.value !== undefined) {
                    const objectChoices = values.objectChoices.map((oc) => {
                        if (/^\d+$/.test(String(oc.id))) {
                            return { ...oc, id: Number(oc.id) };
                        } else {
                            return { ...oc, id: 0 };
                        }
                    });
                    console.log('ready to submit', { values });
                    if (
                        await onSubmit(
                            values.title,
                            values.type?.value,
                            values.textChoices?.map((tc) => tc.text),
                            objectChoices,
                            values.objectTitle
                        )
                    ) {
                        resetForm();
                    }
                }
            }}>
            {({ isSubmitting, setFieldValue, values, resetForm }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="title"
                            label="Tittel"
                            name="title"
                            autoFocus
                        />
                        <div
                            className={cx(
                                css({
                                    paddingBottom: theme.spacing(2)
                                })
                            )}>
                            <label htmlFor="type-select">Type</label>
                            <Select
                                inputId="type-select"
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable
                                onChange={(selected) => {
                                    if (selected !== null) {
                                        setFieldValue('type', selected);
                                    }
                                }}
                                value={values.type}
                                name="user"
                                options={formsFieldTypeOption}
                                styles={{
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999
                                    })
                                }}
                                menuPortalTarget={document.body}
                            />
                        </div>

                        <TextChoicesField />
                        <ObjectChoicesField />
                        <ButtonGroup fullWidth>
                            <Button onClick={goBack}>Tilbake</Button>
                            {field && (
                                <Button
                                    color="warning"
                                    variant="contained"
                                    onClick={() => {
                                        resetForm();
                                        setSelectedField(undefined);
                                    }}>
                                    Legg til ny
                                </Button>
                            )}
                            <MuiLoadingButton
                                loading={isSubmitting}
                                type="submit"
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained">
                                Lagre
                            </MuiLoadingButton>
                        </ButtonGroup>
                    </Form>
                );
            }}
        </Formik>
    );
};

const TextChoicesField = () => {
    const { css, cx, theme } = useStyles();
    const {
        values: { type, textChoices },
        setFieldValue
    } = useFormikContext<FormValues>();

    const handleTextChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        tcId: string
    ) => {
        setFieldValue(
            'textChoices',
            textChoices?.map((tc) =>
                tc.id === tcId ? { ...tc, text: e.target.value } : tc
            )
        );
    };

    const handleAddNewTextRow = () => {
        if (textChoices !== undefined) {
            setFieldValue('textChoices', [
                ...textChoices,
                { id: uuidv4(), text: '' }
            ]);
        } else {
            setFieldValue('textChoices', [{ id: 0, text: '' }]);
        }
    };
    const handleDeleteTextRow = (tcId: string) => {
        if (textChoices !== undefined) {
            setFieldValue(
                'textChoices',
                textChoices.filter((tc) => tc.id !== tcId)
            );
        }
    };

    if (type?.value === FormsFieldTypeEnum.preDef) {
        return (
            <div>
                {textChoices?.map((tc) => {
                    return (
                        <Grid key={tc.id} container>
                            <Grid key={tc.id} item xs={9}>
                                <MuiTextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id={`textChoices-${tc.id}`}
                                    label="Tekst valg"
                                    name="textChoice"
                                    onChange={(e) => handleTextChange(e, tc.id)}
                                    value={tc.text}
                                />
                            </Grid>
                            <Grid
                                key={`{${tc.id}SecondGrid`}
                                item
                                xs="auto"
                                className={cx(
                                    css({
                                        margin: 'auto',
                                        marginLeft: theme.spacing(1)
                                    })
                                )}>
                                <ButtonGroup>
                                    <Button
                                        color="info"
                                        aria-label="Legg til"
                                        size="large"
                                        onClick={handleAddNewTextRow}>
                                        <AddIcon />
                                    </Button>

                                    <Button
                                        color="error"
                                        aria-label="Slett"
                                        size="large"
                                        onClick={() =>
                                            handleDeleteTextRow(tc.id)
                                        }>
                                        <DeleteIcon />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    );
                })}
            </div>
        );
    }
    return <div />;
};
const ObjectChoicesField = () => {
    const { css, cx, theme } = useStyles();
    const {
        values: { type, objectChoices },
        setFieldValue
    } = useFormikContext<FormValues>();

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        tcId: string | number,
        name: 'text' | 'title'
    ) => {
        setFieldValue(
            'objectChoices',
            objectChoices?.map((tc) =>
                tc.id === tcId ? { ...tc, [name]: e.target.value } : tc
            )
        );
    };

    const handleAddNewTextRow = () => {
        if (objectChoices !== undefined) {
            setFieldValue('objectChoices', [
                ...objectChoices,
                {
                    id: uuidv4(),
                    text: '',
                    title: ''
                }
            ]);
        } else {
            setFieldValue('objectChoices', [
                {
                    id: uuidv4(),
                    text: '',
                    title: ''
                }
            ]);
        }
    };
    const handleDeleteTextRow = (tcId: string | number) => {
        if (objectChoices !== undefined) {
            setFieldValue(
                'objectChoices',
                objectChoices.filter((tc) => tc.id !== tcId)
            );
        }
    };

    if (type?.value === FormsFieldTypeEnum.preDefObj) {
        return (
            <>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="objectTitle"
                            label="Objekt tittel"
                            name="objectTitle"
                            autoFocus
                        />
                    </Grid>
                </Grid>
                <div>
                    {objectChoices?.map((tc) => {
                        return (
                            <Grid key={tc.id} container>
                                <Grid item xs={12}>
                                    <Divider>
                                        <Chip
                                            label={`Alternativ ID: ${tc.id}`}
                                        />
                                    </Divider>
                                </Grid>
                                <Grid item xs={9}>
                                    <MuiTextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id={`objectChoice-${tc.id}`}
                                        label="Alternativ tittel"
                                        name={`objectChoice-${tc.id}`}
                                        onChange={(e) =>
                                            handleChange(e, tc.id, 'title')
                                        }
                                        value={tc.title}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs="auto"
                                    className={cx(
                                        css({
                                            margin: 'auto',
                                            marginLeft: theme.spacing(1)
                                        })
                                    )}>
                                    <ButtonGroup>
                                        <Button
                                            color="info"
                                            aria-label="Legg til"
                                            size="large"
                                            onClick={handleAddNewTextRow}>
                                            <AddIcon />
                                        </Button>

                                        <Button
                                            color="error"
                                            aria-label="Slett"
                                            size="large"
                                            onClick={() =>
                                                handleDeleteTextRow(tc.id)
                                            }>
                                            <DeleteIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiTextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        multiline
                                        id={`objectChoice-${tc.id}`}
                                        label="Alternativ tekst"
                                        name={`objectChoice-${tc.id}`}
                                        onChange={(e) =>
                                            handleChange(e, tc.id, 'text')
                                        }
                                        value={tc.text}
                                    />
                                </Grid>
                            </Grid>
                        );
                    })}
                </div>
            </>
        );
    }
    return <div />;
};
