import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { RapportEgenskaper, ReportKontroll } from '../contracts/reportApi';
import { useEffect, useMemo } from 'react';

import Grid from '@mui/material/Grid';
import { Klient } from '../contracts/kontrollApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { Sertifikat } from '../contracts/certificateApi';
import { TextField } from '../components/input';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { User } from '../contracts/userApi';
import { makeStyles } from '../theme/makeStyles';
import { useState } from 'react';
import { useUsers } from '../api/hooks/useUsers';
import { useZipCode } from '../api/hooks/useUtils';

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
    const { classes } = useStyles();

    const usersData = useUsers();

    const [userOptions, setUserOptions] = useState<Option[]>();
    const [sertifikatOptions, setSertifikatOptions] = useState<
        Array<SertifikatOption>
    >([]);

    useEffect(() => {
        if (usersData.data !== undefined) {
            setUserOptions(
                usersData.data.map((u) => ({ value: u, label: u.name }))
            );
        }
    }, [usersData.data]);

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

            if (
                kontroll.rapportEgenskaper?.sertifikater &&
                kontroll.rapportEgenskaper?.sertifikater.length > 0
            )
                sertifikater = kontroll.rapportEgenskaper?.sertifikater.map(
                    (s) => {
                        return { value: s, label: s.type.name };
                    }
                );
        }

        const klient = klienter.find(
            (k) => k.id === kontroll.location.klient.id
        );
        const location = klient?.locations.find(
            (o) => o.id === kontroll.location.id
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
                validationSchema={Yup.object({
                    postnr: Yup.number()
                        .typeError('Postnr m?? v??re et tall p?? 4 siffer')
                        .required('Postnr er p??krevd'),
                    poststed: Yup.string().required('Poststed er p??krevd'),
                    kontaktperson: Yup.string().required(
                        'Kontaktperson er p??krevd'
                    ),
                    kontrollsted: Yup.string().required(
                        'Kontrollsted er p??krevd'
                    ),
                    oppdragsgiver: Yup.string().required(
                        'Oppdragsgiver er p??krevd'
                    ),
                    adresse: Yup.string().required('Adresse er p??krevd')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    const sertifikater =
                        values.sertifikater !== null
                            ? values.sertifikater?.map((a) => a.value)
                            : undefined;
                    if (
                        !(await onSubmit({
                            ...values,
                            rapportUser:
                                values.rapportUser !== null
                                    ? values.rapportUser.value
                                    : null,
                            sertifikater:
                                sertifikater !== undefined ? sertifikater : []
                        }))
                    ) {
                        setSubmitting(false);
                    }
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
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
                                    <ZipCodeField
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
                                {/* Kontakt person  */}
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="kontaktperson"
                                        label="Navn kontaktperson"
                                        name="kontaktperson"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="kontaktTelefon"
                                        label="Telefon kontaktperson"
                                        name="kontaktTelefon"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="kontaktEpost"
                                        label="Epost kontaktperson"
                                        name="kontaktEpost"
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
                                    {usersData.data && (
                                        <div>
                                            <label htmlFor="rapportUser-select">
                                                Kontroll??r
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
                                            <Typography component="span">
                                                Epost og telefon m?? endres p??
                                                den enkeltes profil
                                            </Typography>
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
const useStyles = makeStyles()((theme: Theme) => ({
    formGroup: {
        borderStyle: 'solid',
        borderColor: '#7A7A7A',
        backgroundColor: '#ffffff',
        padding: theme.spacing(2),
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
interface ZipCodeFieldProps {
    name: string;
    label: string;
}
const ZipCodeField = ({ name, label }: ZipCodeFieldProps) => {
    const {
        values: { postnr },
        setFieldValue
    } = useFormikContext<FormValues>();

    const zipCodeData = useZipCode({
        code: postnr
    });

    useEffect(() => {
        console.log(zipCodeData.data);
        if (zipCodeData.data) {
            setFieldValue('poststed', zipCodeData.data.poststed);
        }
        console.log('save ZipCode');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zipCodeData.data]);

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
