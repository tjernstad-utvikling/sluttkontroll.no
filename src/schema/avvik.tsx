import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Avvik } from '../contracts/avvikApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUsers } from '../api/hooks/useUsers';

interface AvvikSchemaProps {
    avvik?: Avvik;
    beskrivelse?: string;
    onSubmit: (
        beskrivelse: string,
        kommentar: string,
        utbedrer: Array<User> | null
    ) => Promise<boolean>;
}
export const AvvikSchema = ({
    avvik,
    beskrivelse,
    onSubmit
}: AvvikSchemaProps): JSX.Element => {
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

    if (userOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    beskrivelse:
                        beskrivelse !== undefined
                            ? beskrivelse
                            : avvik?.beskrivelse || '',
                    kommentar: avvik?.kommentar || '',
                    utbedrer:
                        avvik !== undefined
                            ? avvik.utbedrer.map((a) => {
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
                    beskrivelse: Yup.string().required('Beskrivelse er påkrevd')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    await onSubmit(
                        values.beskrivelse,
                        values.kommentar,
                        values.utbedrer !== null
                            ? values.utbedrer.map((ut) => ut.value)
                            : null
                    );
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
                    return (
                        <Form>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="beskrivelse"
                                label="Avvik"
                                name="beskrivelse"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="kommentar"
                                label="Kommentar"
                                name="kommentar"
                            />
                            {usersData.data && (
                                <>
                                    <label htmlFor="avvikUtbedrere-select">
                                        Utbedres av
                                    </label>
                                    <Select
                                        inputId="avvikUtbedrere-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        isMulti
                                        onChange={(selected) => {
                                            setFieldValue('utbedrer', selected);
                                        }}
                                        value={values.utbedrer}
                                        name="utbedrer"
                                        options={userOptions}
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
