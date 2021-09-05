import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Checkpoint } from '../contracts/checkpointApi';
import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';

interface CheckpointSchemaProps {
    checkpoint?: Checkpoint | undefined;
    onSubmit: (
        prosedyre: string,
        prosedyreNr: string,
        tekst: string,
        gruppe: string
    ) => Promise<boolean>;
}
export const CheckpointSchema = ({
    checkpoint,
    onSubmit
}: CheckpointSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                prosedyre: checkpoint?.prosedyre || '',
                prosedyreNr: checkpoint?.prosedyreNr || '',
                tekst: checkpoint?.tekst || '',
                gruppe: checkpoint?.gruppe || ''
            }}
            validationSchema={Yup.object({
                prosedyre: Yup.string().required('Prosedyre er påkrevd'),
                prosedyreNr: Yup.string().required('Prosedyre nr er påkrevd'),
                tekst: Yup.string().required('Avvikstekst er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(
                    values.prosedyre,
                    values.prosedyreNr,
                    values.tekst,
                    values.gruppe
                );
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="prosedyreNr"
                                    label="Prosedyre nummer"
                                    name="prosedyreNr"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="prosedyre"
                                    label="Prosedyre"
                                    name="prosedyre"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary">
                                    Lagre
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};
