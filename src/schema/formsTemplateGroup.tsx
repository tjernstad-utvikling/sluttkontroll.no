import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { FormsGroup } from '../contracts/sjaApi';
import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';

interface FormsTemplateGroupSchemaProps {
    group?: FormsGroup;
    onSubmit: (title: string, description: string) => Promise<boolean>;
}
export const FormsTemplateGroupSchema = ({
    group,
    onSubmit
}: FormsTemplateGroupSchemaProps): JSX.Element => {
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
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.title, values.description);
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
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

                        <LoadingButton
                            isLoading={isSubmitting}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary">
                            Lagre
                        </LoadingButton>
                    </Form>
                );
            }}
        </Formik>
    );
};
