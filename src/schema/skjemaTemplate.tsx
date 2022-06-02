import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import { Template } from '../contracts/skjemaTemplateApi';
import { TextField } from '../components/input';

interface SkjemaTemplateSchemaProps {
    template?: Template;
    onSubmit: (name: string) => Promise<boolean>;
    checkpointCount?: number;
}
export const SkjemaTemplateSchema = ({
    template,
    onSubmit,
    checkpointCount
}: SkjemaTemplateSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                name: template?.name || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
                name: Yup.string().required('Navn er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.name);
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Navn på mal"
                            name="name"
                            autoFocus
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
