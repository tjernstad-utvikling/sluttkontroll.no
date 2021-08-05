import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import {
    Klient,
    RapportEgenskaper,
    ReportKontroll
} from '../contracts/kontrollApi';
import { Sertifikat, User } from '../contracts/userApi';
import { useEffect, useMemo } from 'react';

import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
import { useUser } from '../data/user';

interface Option {
    value: User;
    label: string;
}
interface SertifikatOption {
    value: Sertifikat;
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
    sertifikater: SertifikatOption | null;
}
interface ReportPropertiesSchemaProps {
    onSubmit: (reportProperties: RapportEgenskaper) => Promise<boolean>;
    kontroll: ReportKontroll;
    klienter: Klient[];
}
export const ReportPropertiesSchema = ({
    onSubmit,
    kontroll,
    klienter
}: ReportPropertiesSchemaProps): JSX.Element => {
    const classes = useStyles();
    const {
        state: { users },
        loadUsers
    } = useUser();

    const [userOptions, setUserOptions] = useState<Array<Option>>();
    const [sertifikatOptions, setSertifikatOptions] = useState<
        Array<SertifikatOption>
    >([]);

    useEffect(() => {
        if (users !== undefined) {
            setUserOptions(users.map((u) => ({ value: u, label: u.name })));
        }
    }, [users]);

    useEffectOnce(() => {
        loadUsers();
    });
    const initialData = useMemo(() => {
        let user =
            kontroll !== undefined
                ? userOptions?.find(
                      (u) =>
                          u.value.id ===
                          kontroll.rapportEgenskaper?.rapportUser?.id
                  )
                : null;
        if (!user) {
            user =
                kontroll !== undefined
                    ? userOptions?.find((u) => u.value.id === kontroll.user.id)
                    : null;
        }
        let sertifikater = null;
        if (user !== null) {
            const userSertifikater: Array<SertifikatOption> | undefined =
                user?.value.sertifikater.map((s) => ({
                    value: s,
                    label: s.type.name
                }));
            setSertifikatOptions(
                userSertifikater !== undefined ? userSertifikater : []
            );

            sertifikater = kontroll.rapportEgenskaper?.sertifikater.map((s) => {
                return { value: s, label: s.type.name };
            });
        }

        const klient = klienter.find((k) => k.id === kontroll.Objekt.klient.id);
        const location = klient?.objekts.find(
            (o) => o.id === kontroll.Objekt.id
        );
        if (kontroll.rapportEgenskaper !== null) {
            const user =
                kontroll !== undefined &&
                kontroll.rapportEgenskaper.rapportUser !== null
                    ? userOptions?.find(
                          (u) =>
                              u.value.id ===
                              kontroll.rapportEgenskaper?.rapportUser?.id
                      )
                    : null;
            return {
                ...kontroll.rapportEgenskaper,
                kontrollerEpost: user !== undefined ? user?.value.email : '',
                kontrollerTelefon: user !== undefined ? user?.value.phone : '',
                rapportUser: user !== undefined ? user : null,
                sertifikater
            };
        }
        return {
            adresse: '',
            id: 0,
            kontaktEpost: '',
            kontaktTelefon: '',
            kontaktperson: '',
            kontrollerEpost: user !== undefined ? user?.value.email : '',
            kontrollerTelefon: user !== undefined ? user?.value.phone : '',
            kontrollsted: location !== undefined ? location.name : '',
            oppdragsgiver: klient !== undefined ? klient.name : '',
            postnr: '',
            poststed: '',
            rapportUser: user !== undefined ? user : null,
            sertifikater
        };
    }, [klienter, kontroll, userOptions]);

    if (userOptions !== undefined) {
        return (
            <Formik
                initialValues={initialData}
                validationSchema={Yup.object({})}
                onSubmit={async (values, { setSubmitting }) => {
                    const sertifikater =
                        values.sertifikater !== null
                            ? values.sertifikater?.map((a) => a.value)
                            : undefined;
                    await onSubmit({
                        ...values,
                        rapportUser:
                            values.rapportUser !== null
                                ? values.rapportUser.value
                                : null,
                        sertifikater:
                            sertifikater !== undefined ? sertifikater : []
                    });
                    setSubmitting(false);
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
                                <Grid item xs={12}>
                                    {sertifikatOptions && (
                                        <KontrollerSertifikatField
                                            sertifikatOptions={
                                                sertifikatOptions
                                            }
                                            setSertifikatOptions={
                                                setSertifikatOptions
                                            }
                                        />
                                    )}
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
            readonly
            variant="outlined"
            fullWidth
            id={name}
            label={label}
            name={name}
        />
    );
};

interface KontrollerSertifikatFieldProps {
    sertifikatOptions: SertifikatOption[];
    setSertifikatOptions: React.Dispatch<
        React.SetStateAction<SertifikatOption[]>
    >;
}
const KontrollerSertifikatField = ({
    sertifikatOptions,
    setSertifikatOptions
}: KontrollerSertifikatFieldProps) => {
    const {
        values: { sertifikater, rapportUser },
        setFieldValue
    } = useFormikContext<FormValues>();

    useEffect(() => {
        if (rapportUser !== null) {
            setFieldValue('sertifikater', null);
            setSertifikatOptions(
                rapportUser?.value.sertifikater.map((s) => ({
                    value: s,
                    label: s.type.name
                }))
            );
        }
    }, [rapportUser, setFieldValue, setSertifikatOptions]);

    return (
        <div>
            <label htmlFor="sertifikat-select">Sertifikater</label>
            <Select
                inputId="sertifikat-select"
                className="basic-single"
                classNamePrefix="select"
                isSearchable
                isMulti
                onChange={(selected) => {
                    if (selected !== null) {
                        setFieldValue('sertifikater', selected);
                    }
                }}
                value={sertifikater}
                name="sertifikater"
                options={sertifikatOptions}
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                    })
                }}
                menuPortalTarget={document.body}
            />
        </div>
    );
};
