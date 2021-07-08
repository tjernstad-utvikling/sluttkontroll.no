import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Kontroll } from '../contracts/kontrollApi';
import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';

interface KontrollSchemaProps {
    kontroll: Kontroll;
}
export const KontrollSchema = ({
    kontroll
}: KontrollSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                email: kontroll.name,
                password: ''
            }}
            validationSchema={Yup.object({
                email: Yup.string()
                    .email('Epost er ugyldig')
                    .required('Epost er påkrevd'),
                password: Yup.string().required('Påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {}}>
            {({ isSubmitting }) => (
                <Form>
                    <TextField
                        variant="outlined"
                        fullWidth
                        id="email"
                        label="Epost"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        type="email"
                    />

                    <TextField
                        variant="outlined"
                        fullWidth
                        name="password"
                        label="Passord"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <LoadingButton
                        isLoading={isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary">
                        Logg inn
                    </LoadingButton>
                </Form>
            )}
        </Formik>
    );
};
