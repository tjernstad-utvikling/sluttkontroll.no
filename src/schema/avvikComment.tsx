import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';
import Typography from '@material-ui/core/Typography';

interface AvvikCommentSchemaProps {
    onSubmit: (kommentar: string) => Promise<boolean>;
}
export const AvvikCommentSchema = ({
    onSubmit
}: AvvikCommentSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                kommentar: ''
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
                        <Typography>
                            Kommentar bør inneholde noe om hvem som er ansvarlig
                            for lukkingen
                        </Typography>

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
