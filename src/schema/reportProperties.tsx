import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { useEffect, useMemo } from 'react';

import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import { ReportKontroll } from '../contracts/kontrollApi';
import Select from 'react-select';
import { TextField } from '../components/input';
import Typography from '@material-ui/core/Typography';
import { User } from '../contracts/userApi';
import { makeStyles } from '@material-ui/core/styles';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
import { useUser } from '../data/user';

interface Option {
    value: User;
    label: string;
}
interface FormValues {
    rapportUser: Option | null;
    adresse: string;
    kontaktEpost: string;
    kontaktTelefon: string;
    kontaktperson: string;
    kontrollerEpost: string;
    kontrollerTelefon: string;
    kontrollsted: string;
    oppdragsgiver: string;
    postnr: string;
    poststed: string;
    sertifikater: [];
}
interface ReportPropertiesSchemaProps {
    onSubmit: () => void;
    kontroll: ReportKontroll;
}
export const ReportPropertiesSchema = ({
    onSubmit,
    kontroll
}: ReportPropertiesSchemaProps): JSX.Element => {
    const classes = useStyles();
    const {
        state: { users },
        loadUsers
    } = useUser();

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
        const user =
            kontroll !== undefined
                ? userOptions?.find((u) => u.value.id === kontroll.user.id)
                : null;
        if (kontroll.rapportEgenskaper !== null) {
            return kontroll.rapportEgenskaper;
        }
        return {
            adresse: '',
            id: 0,
            kontaktEpost: '',
            kontaktTelefon: '',
            kontaktperson: '',
            kontrollerEpost: user !== undefined ? user?.value.email : '',
            kontrollerTelefon: user !== undefined ? user?.value.phone : '',
            kontrollsted: '',
            oppdragsgiver: '',
            postnr: '',
            poststed: '',
            rapportUser: user !== undefined ? user : null,
            sertifikater: ''
        };
    }, [kontroll, userOptions]);

    if (userOptions !== undefined) {
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
                            <Grid
                                container
                                spacing={3}
                                className={classes.formGroup}>
                                <Typography
                                    variant="h3"
                                    className={classes.blockTitle}>
                                    Informasjon om inspeksjonsstedet
                                </Typography>
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
                            </Grid>
                            {/* Kontrollert av under */}
                            <Grid
                                container
                                spacing={3}
                                className={classes.formGroup}>
                                <Typography
                                    variant="h3"
                                    className={classes.blockTitle}>
                                    Kontrollert av
                                </Typography>
                                <Grid item xs={12}>
                                    {users && (
                                        <div>
                                            <label htmlFor="rapportUser-select">
                                                Kontrollør
                                            </label>
                                            <Select
                                                inputId="rapportUser-select"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isSearchable
                                                onChange={(selected) => {
                                                    if (selected !== null) {
                                                        setFieldValue(
                                                            'rapportUser',
                                                            selected
                                                        );
                                                    }
                                                }}
                                                value={values.rapportUser}
                                                name="rapportUser"
                                                options={userOptions}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999
                                                    })
                                                }}
                                                menuPortalTarget={document.body}
                                            />
                                        </div>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KontrollerContactField
                                        userProp="email"
                                        label="Epost"
                                        name="kontrollerEpost"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KontrollerContactField
                                        userProp="phone"
                                        label="Telefon"
                                        name="kontrollerTelefon"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
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
    }
    return <div>Laster</div>;
};

export const useStyles = makeStyles((theme) => ({
    formGroup: {
        borderStyle: 'solid',
        borderColor: theme.palette.primary.main,
        borderWidth: '1px',
        borderRadius: 3,
        marginBottom: 18,
        marginTop: 2
    },
    blockTitle: {
        fontSize: '1.2rem',
        padding: 12,
        paddingBottom: 0
    }
}));

interface KontrollerContactFieldProps {
    userProp: 'email' | 'phone';
    name: string;
    label: string;
}
const KontrollerContactField = ({
    name,
    label,
    userProp
}: KontrollerContactFieldProps) => {
    const {
        values: { rapportUser },
        setFieldValue
    } = useFormikContext<FormValues>();

    useEffect(() => {
        if (rapportUser !== null) {
            setFieldValue(name, rapportUser.value[userProp] ?? '');
        }
    }, [setFieldValue, rapportUser, userProp, name]);

    return (
        <TextField
            variant="outlined"
            fullWidth
            id={name}
            label={label}
            name={name}
        />
    );
};
