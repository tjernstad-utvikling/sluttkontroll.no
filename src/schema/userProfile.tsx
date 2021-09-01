import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { Roles, RolesDesc, RolesOptions, User } from '../contracts/userApi';
import { useEffect, useMemo } from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import Switch from '@material-ui/core/Switch';
import { TextField } from '../components/input';
import Typography from '@material-ui/core/Typography';
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
    password: string;
    changePassword: boolean;
    roles: Option[] | null;
}
interface UserProfileSchemaProps {
    onSubmit: (
        name: string,
        phone: string,
        email: string,
        password: string,
        changePassword: boolean,
        roles: Roles[] | undefined
    ) => Promise<boolean>;
    user?: User | undefined;
}
export const UserProfileSchema = ({
    onSubmit,
    user
}: UserProfileSchemaProps): JSX.Element => {
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
                password: '',
                changePassword: false,
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
                await onSubmit(
                    values.name,
                    values.phone,
                    values.email,
                    values.password,
                    values.changePassword,
                    roles
                );
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
                                <PasswordField />
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

const PasswordField = () => {
    const {
        values: { changePassword },
        setFieldValue
    } = useFormikContext<FormValues>();

    return (
        <>
            <FormControlLabel
                control={
                    <Switch
                        checked={changePassword}
                        onChange={() =>
                            setFieldValue('changePassword', !changePassword)
                        }
                        name="changePassword"
                        color="primary"
                    />
                }
                label="Endre passord"
            />
            {changePassword && (
                <TextField
                    variant="outlined"
                    fullWidth
                    id="password"
                    label="Passord"
                    name="password"
                    type="password"
                />
            )}
        </>
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
