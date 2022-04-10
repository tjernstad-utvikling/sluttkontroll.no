import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import CreatableSelect from 'react-select/creatable';
import { Klient } from '../contracts/kontrollApi';
import { LoadingButton } from '../components/button';
import { TextField } from '../components/input';
import { useClients } from '../api/hooks/useKlient';
import { useEffect } from 'react';
import { useState } from 'react';

interface KlientSchemaProps {
    klient?: Klient;
    onSubmit: (name: Klient) => void;
    onCreateNew: (name: string) => Promise<boolean>;
}
export const KlientSchema = ({
    klient,
    onSubmit,
    onCreateNew
}: KlientSchemaProps): JSX.Element => {
    const clientData = useClients();

    interface Option {
        value: Klient;
        label: string;
    }
    const [klientOptions, setKlientOptions] = useState<Array<Option>>();

    useEffect(() => {
        if (clientData.data !== undefined) {
            setKlientOptions(
                clientData.data.map((k) => ({ value: k, label: k.name }))
            );
        }
    }, [clientData.data]);

    if (klientOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    name:
                        klient !== undefined
                            ? klientOptions?.find(
                                  (k) => k.value.id === klient.id
                              ) !== undefined
                                ? klientOptions?.find(
                                      (k) => k.value.id === klient.id
                                  )
                                : null
                            : null
                }}
                validationSchema={Yup.object({})}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.name !== null && values.name !== undefined) {
                        onSubmit(values.name.value);
                    }
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
                    return (
                        <Form>
                            {clientData.data && (
                                <div>
                                    <label htmlFor="klient-select">Kunde</label>
                                    <CreatableSelect
                                        onCreateOption={(newName) => {
                                            onCreateNew(newName);
                                        }}
                                        onChange={(selected) => {
                                            if (selected !== null) {
                                                setFieldValue('name', selected);
                                            }
                                        }}
                                        value={values.name}
                                        name="name"
                                        options={klientOptions}
                                        menuPortalTarget={document.querySelector(
                                            'body'
                                        )}
                                    />
                                    <span>
                                        Velg kunde, nye kunder blir automatisk
                                        lagt til
                                    </span>
                                </div>
                            )}

                            <LoadingButton
                                isLoading={isSubmitting}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary">
                                Velg og neste
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

interface KlientEditSchemaProps {
    klient: Klient;
    onSubmit: (name: string) => Promise<void>;
}
export const KlientEditSchema = ({
    klient,
    onSubmit
}: KlientEditSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                name: klient.name
            }}
            validationSchema={Yup.object({})}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.name);
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Kunde navn"
                            name="name"
                            autoFocus
                        />

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
};
