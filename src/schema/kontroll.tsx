import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Kontroll } from '../contracts/kontrollApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '../data/user';

interface KontrollSchemaProps {
    kontroll: Kontroll;
}
export const KontrollSchema = ({
    kontroll
}: KontrollSchemaProps): JSX.Element => {
    const {
        state: { users }
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

    const user = userOptions?.find((u) => u.value.id === kontroll.user.id);
    if (userOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    name: kontroll.name,
                    user: user !== undefined ? user : ({} as Option),
                    avvikUtbedrere: kontroll.avvikUtbedrere.map((a) => {
                        let user = userOptions.find((u) => u.value.id === a.id);
                        return user !== undefined ? user : ({} as Option);
                    })
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Kontroll navn er påkrevd')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    console.log(values);
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
                            {users && (
                                <div>
                                    <label htmlFor="user-select">
                                        Kontrollen utføres av
                                    </label>
                                    <Select
                                        inputId="user-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        onChange={(selected) => {
                                            if (selected !== null) {
                                                setFieldValue(
                                                    'user',
                                                    selected.value
                                                );
                                            }
                                        }}
                                        value={values.user}
                                        name="user"
                                        options={userOptions}
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
                                    />
                                </div>
                            )}

                            <LoadingButton
                                isLoading={isSubmitting}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary">
                                Logg inn
                            </LoadingButton>
                        </Form>
                    );
                }}
            </Formik>
        );
    } else {
        return <div></div>;
    }
};
