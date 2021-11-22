import * as Yup from 'yup';

import { DateInput, TextField } from '../components/input';
import { Form, Formik } from 'formik';
import { Sertifikat, SertifikatType } from '../contracts/certificateApi';
import { useEffect, useMemo } from 'react';

import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import Select from 'react-select';
import { useState } from 'react';

interface Option {
    value: SertifikatType;
    label: string;
}

interface CertificateSchemaProps {
    onSubmit: (
        number: string,
        type: SertifikatType,
        validTo: string
    ) => Promise<boolean>;
    certificateTypes: SertifikatType[];
    certificate?: Sertifikat | undefined;
}
export const CertificateSchema = ({
    onSubmit,
    certificateTypes,
    certificate
}: CertificateSchemaProps): JSX.Element => {
    const [sertifikatOptions, setSertifikatOptions] = useState<Option[]>();

    useEffect(() => {
        if (certificateTypes !== undefined) {
            setSertifikatOptions(
                certificateTypes.map((st) => ({ value: st, label: st.name }))
            );
        }
    }, [certificateTypes]);

    const selectedType = useMemo(() => {
        let preSelectedType: SertifikatType | null = null;
        if (certificate !== undefined) {
            preSelectedType = certificate.type;
        }
        const option = sertifikatOptions?.find(
            (o) => o.value === preSelectedType
        );
        if (option !== undefined) {
            return option;
        }
        return null;
    }, [certificate, sertifikatOptions]);

    return (
        <Formik
            initialValues={{
                type: selectedType,
                number: '',
                validTo: ''
            }}
            validationSchema={Yup.object({
                number: Yup.string().required('Sertifikat nummer er påkrevd'),
                validTo: Yup.string().required('Gyldig til dato er påkrevd')
            }).shape({
                type: Yup.object()
                    .nullable(true)
                    .required('Sertifikat type er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                if (values.type) {
                    await onSubmit(
                        values.number,
                        values.type.value,
                        values.validTo
                    );
                }
            }}>
            {({ isSubmitting, setFieldValue, values, errors, touched }) => {
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
                                    {errors.type && touched.type && (
                                        <span>{errors.type}</span>
                                    )}
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
