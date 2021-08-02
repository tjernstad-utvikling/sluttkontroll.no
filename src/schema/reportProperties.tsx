import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { RapportEgenskaper, ReportKontroll } from '../contracts/kontrollApi';
import { useEffect, useMemo } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import { User } from '../contracts/userApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
import { useUser } from '../data/user';

interface ReportPropertiesSchemaProps {
    onSubmit: () => void;
    kontroll: ReportKontroll;
}
export const ReportPropertiesSchema = ({
    onSubmit,
    kontroll
}: ReportPropertiesSchemaProps): JSX.Element => {
    const {
        state: { users },
        loadUsers
    } = useUser();

    interface Option {
        value: User;
        label: string;
    }
    const [userOptions, setUserOptions] = useState<Array<Option>>();

    useEffect(() => {
        if (users !== undefined) {
            setUserOptions(users.map((u) => ({ value: u, label: u.name })));
        }
    }, [users]);

    useEffectOnce(() => {
        loadUsers();
    });
    const initialData = useMemo(() => {
        if (kontroll.rapportEgenskaper !== null) {
            return kontroll.rapportEgenskaper;
        }
        return {
            adresse: '',
            id: 0,
            kontaktEpost: '',
            kontaktTelefon: '',
            kontaktperson: '',
            kontrollerEpost: '',
            kontrollerTelefon: '',
            kontrollsted: '',
            oppdragsgiver: '',
            postnr: '',
            poststed: '',
            rapportUser: '',
            sertifikater: ''
        };
    }, [kontroll]);

    return (
        <Formik
            initialValues={initialData}
            validationSchema={Yup.object({})}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit();
            }}>
            {({ isSubmitting, setFieldValue, values, errors }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="oppdragsgiver"
                                    label="Oppdragsgiver"
                                    name="oppdragsgiver"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="kontrollsted"
                                    label="Kontrollsted"
                                    name="kontrollsted"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="adresse"
                                    label="Adresse"
                                    name="adresse"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="postnr"
                                    label="Postnr"
                                    name="postnr"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="poststed"
                                    label="Poststed"
                                    name="poststed"
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

// const EnhetField = () => {
//     const {
//         values: { type },
//         setFieldValue
//     } = useFormikContext<FormValues>();

//     useEffect(() => {
//         if (type !== null) {
//             setFieldValue('enhet', type.value.enhet);
//         }
//     }, [setFieldValue, type]);

//     return (
//         <TextField
//             variant="outlined"
//             fullWidth
//             id="enhet"
//             label="Enhet"
//             name="enhet"
//         />
//     );
// };
