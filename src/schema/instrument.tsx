import * as Yup from 'yup';

import { Checkbox, TextField } from '../components/input';
import { Form, Formik, useFormikContext } from 'formik';

import Grid from '@mui/material/Grid';
import { Instrument } from '../contracts/instrumentApi';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUsers } from '../api/hooks/useUsers';

interface FormValues {
    name: string;
    serienr: string;
    user: Option | null;
    toCalibrate: boolean;
    calibrationInterval: number;
}
interface Option {
    value: User;
    label: string;
}
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
    const usersData = useUsers();

    const [userOptions, setUserOptions] = useState<Option[]>();

    useEffect(() => {
        if (usersData.data !== undefined) {
            setUserOptions(
                usersData.data.map((u) => ({ value: u, label: u.name }))
            );
        }
    }, [usersData.data]);

    const user =
        instrument !== undefined && instrument.user !== null
            ? userOptions?.find((u) => u.value.id === instrument?.user?.id)
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
                    name: Yup.string().required('Instrument er p??krevd'),
                    serienr: Yup.string().required('Serienummer er p??krevd')
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
                            {usersData.data && (
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
                            <div style={{ marginTop: 10 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        label="Kalibrering av instrument"
                                        name="toCalibrate"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CalibrationIntervalField />
                                </Grid>
                            </Grid>

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
        return <div>Laster brukere</div>;
    }
};

const CalibrationIntervalField = () => {
    const {
        values: { toCalibrate }
    } = useFormikContext<FormValues>();

    if (toCalibrate) {
        return (
            <TextField
                variant="outlined"
                fullWidth
                id="calibrationInterval"
                label="Kalibreringsinterval (mnd)"
                name="calibrationInterval"
            />
        );
    }
    return <div />;
};
