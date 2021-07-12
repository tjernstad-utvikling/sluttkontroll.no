import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import { Skjema } from '../contracts/kontrollApi';
import { TextField } from '../components/input';

interface SkjemaSchemaProps {
    skjema?: Skjema;
    onSubmit: (omrade: string, area: string) => Promise<boolean>;
    checkpointCount?: number;
}
export const SkjemaSchema = ({
    onSubmit,
    checkpointCount
}: SkjemaSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                omrade: '',
                area: ''
            }}
            validationSchema={Yup.object({
                omrade: Yup.string().required('Område navn er påkrevd'),
                area: Yup.string().required('Areal navn er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.area, values.omrade);
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="omrade"
                            label="Område"
                            name="omrade"
                            autoFocus
                        />

                        <TextField
                            variant="outlined"
                            fullWidth
                            id="area"
                            label="Areal"
                            name="area"
                        />

                        <LoadingButton
                            isLoading={isSubmitting}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary">
                            Lagre{' '}
                            {checkpointCount !== undefined
                                ? `(Sjekkpunkter: ${checkpointCount} ) `
                                : ''}
                        </LoadingButton>
                    </Form>
                );
            }}
        </Formik>
    );
};
