import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import {
    MeasurementType,
    NewFormMeasurement
} from '../contracts/measurementApi';
import { useEffect, useMemo } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from 'react-select';
import { TextField } from '../components/input';
import { useMeasurement } from '../data/measurement';
import { useState } from 'react';

interface Option {
    value: MeasurementType;
    label: string;
}

interface FormValues {
    name: string;
    type: Option | null;
    pol: string;
    element: string;
    resultat: string;
    enhet: string;
    maks: string;
    min: string;
}
interface MeasurementSchemaProps {
    onSubmit: (measurement: NewFormMeasurement) => Promise<boolean>;
}
export const MeasurementSchema = ({
    onSubmit
}: MeasurementSchemaProps): JSX.Element => {
    const {
        state: { measurementTypes }
    } = useMeasurement();

    const [options, setOptions] = useState<Array<Option>>();
    const [type, setType] = useState<MeasurementType>();

    useEffect(() => {
        if (measurementTypes !== undefined) {
            setOptions(
                measurementTypes.map((mt) => {
                    let label = mt.longName;
                    if (mt.hasPol) {
                        label = mt.longName.replace('#', '');
                    }
                    return { value: mt, label };
                })
            );
        }
    }, [measurementTypes]);

    const selectedType = useMemo(() => {
        const option = options?.find((o) => o.value.shortName === 'kont');
        if (option !== undefined) {
            return option;
        }
        return null;
    }, [options]);

    if (options !== undefined) {
        return (
            <Formik
                initialValues={{
                    name: '',
                    type: selectedType,
                    pol: '1',
                    element: '',
                    resultat: '',
                    enhet: '',
                    maks: '',
                    min: ''
                }}
                validationSchema={Yup.object({
                    resultat: Yup.number()
                        .typeError('Resultat må være et tall')
                        .transform((_, value) => {
                            return +value.replace(/,/, '.');
                        })
                        .required('Resultat er påkrevd'),
                    enhet: Yup.string().required('Enhet er påkrevd'),
                    maks: Yup.number()
                        .typeError('Maks må være et tall')
                        .transform((_, value) => {
                            return +value.replace(/,/, '.');
                        }),
                    min: Yup.number()
                        .typeError('Resultat må være et tall')
                        .transform((_, value) => {
                            return +value.replace(/,/, '.');
                        })
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    if (values.type !== null) {
                        await onSubmit({
                            ...values,
                            resultat: Number(values.resultat),
                            maks: Number(values.maks),
                            min: Number(values.min),
                            pol: Number(values.pol),
                            type: values.type.value.shortName
                        });
                    }
                }}>
                {({ isSubmitting, setFieldValue, values, errors }) => {
                    return (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    {measurementTypes && (
                                        <div>
                                            <label htmlFor="type-select">
                                                Type
                                            </label>
                                            <Select
                                                inputId="type-select"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isSearchable
                                                onChange={(selected) => {
                                                    if (selected !== null) {
                                                        setFieldValue(
                                                            'type',
                                                            selected
                                                        );
                                                        setType(selected.value);
                                                    }
                                                }}
                                                value={values.type}
                                                name="user"
                                                options={options}
                                                autoFocus
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999
                                                    })
                                                }}
                                                menuPortalTarget={document.body}
                                            />
                                        </div>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {type !== undefined && type.hasPol ? (
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">
                                                Faser
                                            </FormLabel>
                                            <RadioGroup
                                                aria-label="antall faser"
                                                name="pol"
                                                value={values.pol}
                                                onChange={(e, value) => {
                                                    setFieldValue('pol', value);
                                                }}>
                                                <FormControlLabel
                                                    value="1"
                                                    control={<Radio />}
                                                    label="1 Pol"
                                                />
                                                <FormControlLabel
                                                    value="2"
                                                    control={<Radio />}
                                                    label="2 Pol"
                                                />
                                                <FormControlLabel
                                                    value="3"
                                                    control={<Radio />}
                                                    label="3 Pol"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    ) : (
                                        <div />
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="element"
                                        label="Element"
                                        name="element"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="resultat"
                                        label="Resultat"
                                        name="resultat"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <EnhetField />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="maks"
                                        label="Maks"
                                        name="maks"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="min"
                                        label="Min"
                                        name="min"
                                    />
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
    } else {
        return <div>mangler options</div>;
    }
};

const EnhetField = () => {
    const {
        values: { type },
        setFieldValue
    } = useFormikContext<FormValues>();

    useEffect(() => {
        if (type !== null) {
            setFieldValue('enhet', type.value.enhet);
        }
    }, [setFieldValue, type]);

    return (
        <TextField
            variant="outlined"
            fullWidth
            id="enhet"
            label="Enhet"
            name="enhet"
        />
    );
};
