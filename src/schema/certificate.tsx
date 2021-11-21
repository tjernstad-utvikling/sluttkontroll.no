import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { Roles, RolesOptions } from '../contracts/userApi';

import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { SertifikatType } from '../contracts/certificateApi';
import { TextField } from '../components/input';
import Typography from '@mui/material/Typography';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';

interface Option {
    value: SertifikatType;
    label: string;
}

interface FormValues {
    name: string;
    phone: string;
    email: string;
    roles: Option[] | null;
}
interface CertificateSchemaProps {
    onSubmit: (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => Promise<boolean>;
    certificateTypes: SertifikatType;
}
export const CertificateSchema = ({
    onSubmit,
    certificateTypes
}: CertificateSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                type: {} as Option,
                number: '',
                validTo: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Navn er påkrevd'),
                email: Yup.string()
                    .email('Epost er ikke gyldig')
                    .required('Epost er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.name, values.phone, values.email, roles);
            }}>
            {({ isSubmitting, setFieldValue, values, errors }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="name"
                                    label="Navn"
                                    name="name"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="number"
                                    label="Sertifikat nummer"
                                    name="number"
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="phone"
                                    label="Telefon"
                                    name="phone"
                                    type="tel"
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

const RoleSelectField = () => {
    const {
        values: { roles },
        setFieldValue
    } = useFormikContext<FormValues>();

    const [options, setOptions] = useState<Array<Option>>();
    const { userHasRole } = useAuth();

    useEffect(() => {
        setOptions(RolesOptions);
    }, []);

    useEffect(() => {
        if (roles !== null) {
            if (roles.find((opt) => opt.value === Roles.ROLE_LUKKE_AVVIK)) {
                setOptions(
                    RolesOptions.map((opt) => {
                        if (opt.value !== Roles.ROLE_LUKKE_AVVIK) {
                            return { ...opt, isDisabled: true };
                        }
                        return opt;
                    })
                );
            } else {
                setOptions(RolesOptions);
            }
        }
    }, [roles]);

    return (
        <>
            {options && (
                <>
                    <label htmlFor="roller-select">Bruker roller</label>
                    <Select
                        inputId="roller-select"
                        className="basic-single"
                        classNamePrefix="select"
                        isSearchable
                        isMulti
                        isDisabled={!userHasRole(Roles.ROLE_EDIT_ROLES)}
                        onChange={(selected) => {
                            setFieldValue('roles', selected);
                        }}
                        value={roles}
                        name="roles"
                        options={options}
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999
                            })
                        }}
                        menuPortalTarget={document.body}
                    />
                    {roles?.find(
                        (opt) => opt.value === Roles.ROLE_LUKKE_AVVIK
                    ) && (
                        <Typography>
                            Ved brukerrolle "lukke avvik" kan ikke andre roller
                            registreres
                        </Typography>
                    )}
                </>
            )}
        </>
    );
};
