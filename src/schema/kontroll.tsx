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

    const [userOptions, setUserOptions] = useState<
        Array<{ value: User; label: string }>
    >([]);

    useEffect(() => {
        if (users !== undefined) {
            setUserOptions(users.map((u) => ({ value: u, label: u.name })));
        }
    }, [users]);

    return (
        <Formik
            initialValues={{
                name: kontroll.name,
                user: {
                    id: kontroll.user.id,
                    name: users?.find((u) => u.id === kontroll.user.id)?.name
                },
                avvikUtbedrere: kontroll.avvikUtbedrere
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Kontroll navn er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
                console.log(values);
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
                                    Kontroll utføres av
                                </label>
                                <br />
                                <Select
                                    inputId="user-select"
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable
                                    value={{
                                        value: values.user,
                                        label: values.user.name
                                    }}
                                    name="user"
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
};
