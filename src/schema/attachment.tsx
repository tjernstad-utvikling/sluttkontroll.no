import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';

interface AttachmentSchemaProps {
    name: string;
    description: string;
    onSubmit: (name: string, description: string) => Promise<boolean>;
}
export const AttachmentSchema = ({
    onSubmit,
    name,
    description
}: AttachmentSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                name: name || '',
                description: description || ''
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Navn på vedlegg er påkrevd')
            })}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.name, values.description);
            }}>
            {({ isSubmitting }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Navn på vedlegg"
                            name="name"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="description"
                            label="Beskrivelse (valgfri)"
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
