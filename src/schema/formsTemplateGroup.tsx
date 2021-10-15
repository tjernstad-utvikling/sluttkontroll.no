import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FormsGroup } from '../contracts/sjaApi';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { TextField } from '../components/input';
import { useCreateForm } from '../components/forms';

interface FormsTemplateGroupSchemaProps {
    group?: FormsGroup;
    onSubmit: (title: string, description: string) => Promise<boolean>;
    goBack: () => void;
}
export const FormsTemplateGroupSchema = ({
    group,
    onSubmit,
    goBack
}: FormsTemplateGroupSchemaProps): JSX.Element => {
    const { setSelectedGroup } = useCreateForm();

    return (
        <Formik
            initialValues={{
                title: group?.title || '',
                description: group?.description || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
                title: Yup.string().required('Tittel er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (await onSubmit(values.title, values.description)) {
                    resetForm();
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
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="description"
                            label="Beskrivelse"
                            name="description"
                            multiline
                        />
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
                    </Form>
                );
            }}
        </Formik>
    );
};
