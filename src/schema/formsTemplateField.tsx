import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { FormsField, FormsFieldTypeEnum } from '../contracts/sjaApi';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiTextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Select from 'react-select';
import { TextField } from '../components/input';
import { useCreateForm } from '../components/forms';
import { useMemo } from 'react';
import { useStyles } from '../theme/makeStyles';

// id: number;
// title: string;
// type: FieldTypeEnum;
// textChoices?: Array<string>;
// objectChoices?: Array<ObjectChoiceType>;
// objectTitle?: string;

interface PreDefRow {
    id: number;
    text: string;
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
}

interface FormsTemplateFieldSchemaProps {
    field?: FormsField;
    onSubmit: (title: string, type: FormsFieldTypeEnum) => Promise<boolean>;
    goBack: () => void;
}
export const FormsTemplateFieldSchema = ({
    field,
    onSubmit,
    goBack
}: FormsTemplateFieldSchemaProps): JSX.Element => {
    const { setSelectedGroup } = useCreateForm();
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
            return field.textChoices.map((t, i) => ({
                id: i,
                text: t
            }));
        } else {
            return [
                {
                    id: 0,
                    text: ''
                }
            ];
        }
    }, [field]);

    return (
        <Formik
            initialValues={{
                title: field?.title || '',
                type: selectedType,
                textChoices: setTextChoices
            }}
            enableReinitialize
            validationSchema={Yup.object({
                title: Yup.string().required('Tittel er påkrevd'),
                type: Yup.string().required('Felt type er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (values.type?.value !== undefined) {
                    if (await onSubmit(values.title, values.type?.value)) {
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
                        <ButtonGroup fullWidth>
                            <Button onClick={goBack}>Tilbake</Button>
                            {field && (
                                <Button
                                    color="warning"
                                    variant="contained"
                                    onClick={() => {
                                        resetForm();
                                        setSelectedGroup(undefined);
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
    const { css, cx } = useStyles();
    const {
        values: { type, textChoices },
        setFieldValue
    } = useFormikContext<FormValues>();

    const handleTextChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        tcId: number
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
                { id: textChoices.length + 1, text: '' }
            ]);
        } else {
            setFieldValue('textChoices', [{ id: 0, text: '' }]);
        }
    };
    const handleDeleteTextRow = (tcId: number) => {
        if (textChoices !== undefined) {
            setFieldValue(
                'textChoices',
                textChoices.filter((tc) => tc.id !== tcId)
            );
        }
    };

    if (type?.value === FormsFieldTypeEnum.preDef) {
        return (
            <Grid container>
                {textChoices?.map((tc) => {
                    return (
                        <>
                            <Grid item xs={10}>
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
                                item
                                xs="auto"
                                className={cx(
                                    css({
                                        margin: 'auto'
                                    })
                                )}>
                                <ButtonGroup>
                                    <IconButton
                                        color="info"
                                        aria-label="Legg til"
                                        size="large"
                                        onClick={handleAddNewTextRow}>
                                        <AddIcon />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        aria-label="Slett"
                                        size="large"
                                        onClick={() =>
                                            handleDeleteTextRow(tc.id)
                                        }>
                                        <DeleteIcon />
                                    </IconButton>
                                </ButtonGroup>
                            </Grid>
                        </>
                    );
                })}
            </Grid>
        );
    }
    return <div />;
};
