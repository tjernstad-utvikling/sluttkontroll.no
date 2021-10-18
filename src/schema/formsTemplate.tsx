import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FormsTemplate } from '../contracts/sjaApi';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { TextField } from '../components/input';

interface FormsTemplateSchemaProps {
    template?: FormsTemplate;
    onSubmit: (
        title: string,
        subTitle: string,
        description: string
    ) => Promise<boolean>;
    goForward: () => void;
}
export const FormsTemplateSchema = ({
    template,
    onSubmit,
    goForward
}: FormsTemplateSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                title: template?.title || '',
                subTitle: template?.subTitle || '',
                description: template?.description || ''
            }}
            validationSchema={Yup.object({
                title: Yup.string().required('Tittel er påkrevd'),
                subTitle: Yup.string().required('Under tittel er påkrevd')
            })}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(
                    values.title,
                    values.subTitle,
                    values.description
                );
            }}>
            {({ isSubmitting, setFieldValue, values, dirty }) => {
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
                            id="subTitle"
                            label="Under tittel"
                            name="subTitle"
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
                            <MuiLoadingButton
                                loading={isSubmitting}
                                type="submit"
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained">
                                Lagre
                            </MuiLoadingButton>
                            {!dirty && template && (
                                <Button onClick={goForward}>Til grupper</Button>
                            )}
                        </ButtonGroup>
                    </Form>
                );
            }}
        </Formik>
    );
};
