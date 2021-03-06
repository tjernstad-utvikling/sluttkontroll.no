import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Kontroll } from '../contracts/kontrollApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUsers } from '../api/hooks/useUsers';

interface KontrollSchemaProps {
    kontroll?: Kontroll;
    onSubmit: (
        name: string,
        user: User,
        avvikUtbedrere: Array<User> | null
    ) => Promise<boolean>;
}
export const KontrollSchema = ({
    kontroll,
    onSubmit
}: KontrollSchemaProps): JSX.Element => {
    const usersData = useUsers();

    interface Option {
        value: User;
        label: string;
    }
    const [userOptions, setUserOptions] = useState<Array<Option>>();

    useEffect(() => {
        if (usersData.data !== undefined) {
            setUserOptions(
                usersData.data.map((u) => ({ value: u, label: u.name }))
            );
        }
    }, [usersData.data]);

    const user =
        kontroll !== undefined
            ? userOptions?.find((u) => u.value.id === kontroll.user.id)
            : null;
    if (userOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    name: kontroll !== undefined ? kontroll.name : '',
                    user: user !== undefined ? user : null,
                    avvikUtbedrere:
                        kontroll !== undefined
                            ? kontroll.avvikUtbedrere.map((a) => {
                                  let user = userOptions.find(
                                      (u) => u.value.id === a.id
                                  );
                                  return user !== undefined
                                      ? user
                                      : ({} as Option);
                              })
                            : null
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Kontroll navn er p??krevd')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    if (values.user !== null) {
                        await onSubmit(
                            values.name,
                            values.user.value,
                            values.avvikUtbedrere !== null
                                ? values.avvikUtbedrere.map((a) => a.value)
                                : null
                        );
                    }
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
                    return (
                        <Form>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="Kontroll navn"
                                name="name"
                                autoFocus
                            />
                            {usersData.data && (
                                <div>
                                    <label htmlFor="user-select">
                                        Kontrollen utf??res av
                                    </label>
                                    <Select
                                        inputId="user-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        onChange={(selected) => {
                                            if (selected !== null) {
                                                setFieldValue('user', selected);
                                            }
                                        }}
                                        value={values.user}
                                        name="user"
                                        options={userOptions}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            })
                                        }}
                                        menuPortalTarget={document.body}
                                    />
                                    <label htmlFor="avvikUtbedrere-select">
                                        Utbedrere av avvik
                                    </label>
                                    <Select
                                        inputId="avvikUtbedrere-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        isMulti
                                        onChange={(selected) => {
                                            setFieldValue(
                                                'avvikUtbedrere',
                                                selected
                                            );
                                        }}
                                        value={values.avvikUtbedrere}
                                        name="avvikUtbedrere"
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
    } else {
        return <div>mangler options</div>;
    }
};
