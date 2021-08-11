import { Form, Formik } from 'formik';

import { Avvik } from '../contracts/avvikApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
import { useUser } from '../data/user';

interface AvvikUtbedrereSchemaProps {
    selectedAvvik: Avvik[];
    onSubmit: (utbedrer: Array<User> | null) => Promise<boolean>;
}
export const AvvikUtbedrereSchema = ({
    selectedAvvik,
    onSubmit
}: AvvikUtbedrereSchemaProps): JSX.Element => {
    const {
        state: { users },
        loadUsers
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

    useEffectOnce(() => {
        loadUsers();
    });

    if (userOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    utbedrer:
                        selectedAvvik[0] !== undefined
                            ? selectedAvvik[0].utbedrer.map((a) => {
                                  let user = userOptions.find(
                                      (u) => u.value.id === a.id
                                  );
                                  return user !== undefined
                                      ? user
                                      : ({} as Option);
                              })
                            : null
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    await onSubmit(
                        values.utbedrer !== null
                            ? values.utbedrer.map((ut) => ut.value)
                            : null
                    );
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
                    return (
                        <Form>
                            {users && (
                                <>
                                    <Typography>
                                        Alle valgte avvik vil få de samme
                                        utbedrerene
                                    </Typography>
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
