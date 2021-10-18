import * as Yup from 'yup';

import { Checkbox, TextField } from '../components/input';
import { Form, Formik } from 'formik';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FormsGroup } from '../contracts/formsApi';
import Grid from '@mui/material/Grid';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useCreateForm } from '../components/forms';
import { useStyles } from '../theme/makeStyles';

interface FormsTemplateGroupSchemaProps {
    group?: FormsGroup;
    onSubmit: (
        title: string,
        description: string,
        showGroupTitle: boolean
    ) => Promise<boolean>;
    goBack: () => void;
}
export const FormsTemplateGroupSchema = ({
    group,
    onSubmit,
    goBack
}: FormsTemplateGroupSchemaProps): JSX.Element => {
    const { setSelectedGroup } = useCreateForm();

    const { css, cx, theme } = useStyles();

    return (
        <Formik
            initialValues={{
                title: group?.title || '',
                description: group?.description || '',
                showGroupTitle:
                    group === undefined ? true : group.showGroupTitle
            }}
            enableReinitialize
            validationSchema={Yup.object({
                title: Yup.string().required('Tittel er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (
                    await onSubmit(
                        values.title,
                        values.description,
                        values.showGroupTitle
                    )
                ) {
                    resetForm();
                }
            }}>
            {({ isSubmitting, setFieldValue, values, resetForm }) => {
                return (
                    <Form>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="title"
                                    label="Tittel"
                                    name="title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                className={cx(
                                    css({
                                        margin: 'auto',
                                        marginLeft: theme.spacing(1)
                                    })
                                )}>
                                <Checkbox
                                    label="Vis tittel ved utfylling"
                                    name="showGroupTitle"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="description"
                                    label="Beskrivelse"
                                    name="description"
                                    multiline
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonGroup fullWidth>
                                    <Button onClick={goBack}>Tilbake</Button>
                                    {group && (
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
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};
