import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { Instrument } from '../contracts/instrumentApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { TextField } from '../components/input';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
import { useUser } from '../data/user';

interface InstrumentSchemaProps {
    instrument?: Instrument;
    onSubmit: (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ) => Promise<boolean>;
}
export const InstrumentSchema = ({
    instrument,
    onSubmit
}: InstrumentSchemaProps): JSX.Element => {
    const {
        state: { users },
        loadUsers
    } = useUser();

    interface Option {
        value: User;
        label: string;
    }
    const [userOptions, setUserOptions] = useState<Option[]>();

    useEffect(() => {
        if (users !== undefined) {
            setUserOptions(users.map((u) => ({ value: u, label: u.name })));
        }
    }, [users]);

    useEffectOnce(() => {
        loadUsers();
    });

    const user =
        instrument !== undefined
            ? userOptions?.find((u) => u.value.id === instrument.user.id)
            : null;
    if (userOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    name: instrument?.name || '',
                    serienr: instrument?.serienr || '',
                    user: user !== undefined ? user : null,
                    toCalibrate: instrument?.toCalibrate || false,
                    calibrationInterval: instrument?.calibrationInterval || 12
                }}
                validationSchema={Yup.object({
                    beskrivelse: Yup.string().required('Beskrivelse er påkrevd')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    await onSubmit(
                        values.name,
                        values.serienr,
                        values.user !== null ? values.user.value : null,
                        values.toCalibrate,
                        values.calibrationInterval
                    );
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
                    return (
                        <Form>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="Instrument"
                                name="name"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="serienr"
                                label="Serienr"
                                name="serienr"
                            />
                            {users && (
                                <>
                                    <label htmlFor="user-select">
                                        Instrument ansvarlig
                                    </label>
                                    <Select
                                        inputId="user-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        onChange={(selected) => {
                                            setFieldValue('user', selected);
                                        }}
                                        value={values.user}
                                        name="user"
                                        options={userOptions}
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
