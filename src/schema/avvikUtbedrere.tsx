import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import Select from 'react-select';
import Typography from '@mui/material/Typography';
import { User } from '../contracts/userApi';
import { useAvvik } from '../data/avvik';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
import { useUser } from '../data/user';

interface AvvikUtbedrereSchemaProps {
    selectedAvvik: number[];
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

    const {
        state: { avvik }
    } = useAvvik();

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
                            ? avvik
                                  ?.find(
                                      (avvik) => selectedAvvik[0] === avvik.id
                                  )
                                  ?.utbedrer.map((a) => {
                                      let user = userOptions.find(
                                          (u) => u.value.id === a.id
                                      );
                                      return user !== undefined
                                          ? user
                                          : ({} as Option);
                                  }) || null
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
