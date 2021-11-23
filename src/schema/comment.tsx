import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';

interface CommentSchemaProps {
    kommentar: string;
    onSubmit: (kommentar: string) => Promise<boolean>;
}
export const CommentSchema = ({
    onSubmit,
    kommentar
}: CommentSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                kommentar: kommentar || ''
            }}
            validationSchema={Yup.object({
                kommentar: Yup.string().required('Kommentar er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.kommentar);
            }}>
            {({ isSubmitting }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="kommentar"
                            label="Kommentar"
                            name="kommentar"
                            autoFocus
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
