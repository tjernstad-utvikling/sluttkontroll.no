import * as Yup from 'yup';

import { DateInput, TextField } from '../components/input';
import { Form, Formik } from 'formik';

import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import { Roles } from '../contracts/userApi';
import Select from 'react-select';
import { SertifikatType } from '../contracts/certificateApi';
import { useEffect } from 'react';
import { useState } from 'react';

interface Option {
    value: SertifikatType;
    label: string;
}

interface CertificateSchemaProps {
    onSubmit: (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => Promise<boolean>;
    certificateTypes: SertifikatType[];
}
export const CertificateSchema = ({
    onSubmit,
    certificateTypes
}: CertificateSchemaProps): JSX.Element => {
    const [sertifikatOptions, setSertifikatOptions] = useState<Option[]>();

    useEffect(() => {
        if (certificateTypes !== undefined) {
            setSertifikatOptions(
                certificateTypes.map((st) => ({ value: st, label: st.name }))
            );
        }
    }, [certificateTypes]);

    return (
        <Formik
            initialValues={{
                type: null,
                number: '',
                validTo: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Navn er påkrevd'),
                email: Yup.string()
                    .email('Epost er ikke gyldig')
                    .required('Epost er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {}}>
            {({ isSubmitting, setFieldValue, values, errors }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <div>
                                    <label htmlFor="sertifikat-select">
                                        Sertifikater
                                    </label>
                                    <Select
                                        inputId="sertifikat-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        onChange={(selected) => {
                                            setFieldValue('type', selected);
                                        }}
                                        value={values.type}
                                        name="sertifikater"
                                        options={sertifikatOptions}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            })
                                        }}
                                        menuPortalTarget={document.body}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="number"
                                    label="Sertifikat nummer"
                                    name="number"
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DateInput label="Gyldig til" name="validTo" />
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
