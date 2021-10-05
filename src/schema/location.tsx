import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import CreatableSelect from 'react-select/creatable';
import { LoadingButton } from '../components/button';
import { Location } from '../contracts/kontrollApi';
import { TextField } from '../components/input';

interface LocationSchemaProps {
    location?: Location;
    locations: Location[];
    onSubmit: (location: Location) => void;
    onCreateNew: (name: string) => Promise<boolean>;
}
export const LocationSchema = ({
    location,
    locations,
    onSubmit,
    onCreateNew
}: LocationSchemaProps): JSX.Element => {
    interface Option {
        value: Location;
        label: string;
    }
    const [locationOptions, setLocationOptions] = useState<Array<Option>>();

    useEffect(() => {
        if (locations !== undefined) {
            setLocationOptions(
                locations.map((l) => ({ value: l, label: l.name }))
            );
        }
    }, [locations]);

    if (locationOptions !== undefined) {
        return (
            <Formik
                initialValues={{
                    name:
                        location !== undefined
                            ? locationOptions?.find(
                                  (l) => l.value.id === location.id
                              ) !== undefined
                                ? locationOptions?.find(
                                      (l) => l.value.id === location.id
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
                            {locations && (
                                <div>
                                    <label htmlFor="klient-select">
                                        Lokasjon
                                    </label>
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
                                        options={locationOptions}
                                        menuPortalTarget={document.querySelector(
                                            'body'
                                        )}
                                    />
                                    <span>
                                        Velg lokasjon, nye lokasjoner blir
                                        automatisk lagt til
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

interface LocationEditSchemaProps {
    location: Location;
    onSubmit: (name: string) => Promise<void>;
}
export const LocationEditSchema = ({
    location,
    onSubmit
}: LocationEditSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                name: location.name
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
                            label="Lokasjon navn"
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
