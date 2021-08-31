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
import { useState } from 'react';

interface Option {
    value: Roles;
    label: string;
}

interface FormValues {
    name: string;
    phone: string;
    email: string;
    password: string;
    changePassword: boolean;
}
interface UserProfileSchemaProps {
    onSubmit: () => Promise<boolean>;
    user?: User | undefined;
}
export const UserProfileSchema = ({
    onSubmit,
    user
}: UserProfileSchemaProps): JSX.Element => {
    const [options, setOptions] = useState<Array<Option>>();

    useEffect(() => {
        setOptions(RolesOptions);
    }, []);

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
                name: '',
                phone: '',
                email: '',
                password: '',
                changePassword: false,
                roles: selectedRoles
            }}
            validationSchema={Yup.object({})}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit();
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
                                {options && (
                                    <>
                                        <label htmlFor="roller-select">
                                            Bruker roller
                                        </label>
                                        <Select
                                            inputId="roller-select"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isSearchable
                                            isMulti
                                            onChange={(selected) => {
                                                setFieldValue(
                                                    'roles',
                                                    selected
                                                );
                                            }}
                                            value={values.roles}
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
                                    </>
                                )}
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
