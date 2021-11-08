import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { Roles, RolesDesc, RolesOptions, User } from '../contracts/userApi';
import { useEffect, useMemo } from 'react';

import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import Typography from '@mui/material/Typography';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface Option {
    value: Roles;
    isDisabled?: boolean;
    label: string;
}

interface FormValues {
    name: string;
    phone: string;
    email: string;
    roles: Option[] | null;
}
interface UserSchemaProps {
    onSubmit: (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => Promise<boolean>;
    user?: User | undefined;
}
export const UserSchema = ({
    onSubmit,
    user
}: UserSchemaProps): JSX.Element => {
    const selectedRoles = useMemo(() => {
        let selectedRoles = [
            { value: Roles.ROLE_LUKKE_AVVIK, label: RolesDesc.ROLE_LUKKE_AVVIK }
        ];
        if (user !== undefined) {
            selectedRoles = user.roles.map((r) => {
                return { value: r, label: RolesDesc[r] };
            });
        }
        return selectedRoles;
    }, [user]);

    return (
        <Formik
            initialValues={{
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                roles: selectedRoles
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Navn er påkrevd'),
                email: Yup.string()
                    .email('Epost er ikke gyldig')
                    .required('Epost er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                const roles = values.roles?.find(
                    (opt) => opt.value === Roles.ROLE_LUKKE_AVVIK
                )
                    ? [Roles.ROLE_LUKKE_AVVIK]
                    : values.roles.map((opt) => opt.value);
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
                                    id="email"
                                    label="Epost"
                                    name="email"
                                    type="email"
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
                                <RoleSelectField />
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
