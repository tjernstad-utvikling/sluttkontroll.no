import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Checkpoint } from '../contracts/checkpointApi';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import { checkpointGroupOptions } from '../api/hooks/useCheckpoint';

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
    const gruppeOption =
        checkpoint !== undefined
            ? checkpointGroupOptions?.find(
                  (cgo) => cgo.value === checkpoint.gruppe
              )
            : null;
    return (
        <Formik
            initialValues={{
                prosedyre: checkpoint?.prosedyre || '',
                prosedyreNr: checkpoint?.prosedyreNr || '',
                tekst: checkpoint?.tekst || '',
                gruppe: gruppeOption || null
            }}
            validationSchema={Yup.object({
                prosedyre: Yup.string().required('Prosedyre er påkrevd'),
                prosedyreNr: Yup.string().required('Prosedyre nr er påkrevd'),
                tekst: Yup.string().required('Avvikstekst er påkrevd'),
                gruppe: new Yup.MixedSchema().required('Gruppe er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                if (values.gruppe !== null) {
                    await onSubmit(
                        values.prosedyre,
                        values.prosedyreNr,
                        values.tekst,
                        values.gruppe.value
                    );
                }
            }}>
            {({ isSubmitting, setFieldValue, values, errors, touched }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <label htmlFor="user-select">Gruppe</label>
                                <Select
                                    inputId="user-select"
                                    className="basic-single"
                                    classNamePrefix="select"
                                    errorText={touched.gruppe && errors.gruppe}
                                    isSearchable
                                    onChange={(selected) => {
                                        setFieldValue('gruppe', selected);
                                    }}
                                    value={values.gruppe}
                                    name="gruppe"
                                    options={checkpointGroupOptions}
                                    styles={{
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999
                                        })
                                    }}
                                    menuPortalTarget={document.body}
                                />
                                <div>
                                    {errors.gruppe && (
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: 'rgb(244, 67, 54)'
                                            }}>
                                            {errors.gruppe}
                                        </div>
                                    )}
                                </div>
                            </Grid>
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
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    id="tekst"
                                    label="Avvikstekst"
                                    name="tekst"
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
