import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Kontroll } from '../contracts/kontrollApi';
import { LoadingButton } from '../components/button';
import { MeasurementType } from '../contracts/measurementApi';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from 'react-select';
import { TextField } from '../components/input';
import { User } from '../contracts/userApi';
import { useEffect } from 'react';
import { useMeasurement } from '../data/measurement';
import { useState } from 'react';

interface MeasurementSchemaProps {
    kontroll?: Kontroll;
    onSubmit?: (
        name: string,
        user: User,
        avvikUtbedrere: Array<User> | null
    ) => Promise<boolean>;
}
export const MeasurementSchema = ({
    kontroll,
    onSubmit
}: MeasurementSchemaProps): JSX.Element => {
    const {
        state: { measurementTypes }
    } = useMeasurement();

    interface Option {
        value: MeasurementType;
        label: string;
    }
    const [options, setOptions] = useState<Array<Option>>();
    const [type, setType] = useState<MeasurementType>();

    useEffect(() => {
        if (measurementTypes !== undefined) {
            setOptions(
                measurementTypes.map((mt) => {
                    return { value: mt, label: mt.longName };
                })
            );
        }
    }, [measurementTypes]);

    if (options !== undefined) {
        return (
            <Formik
                initialValues={{
                    name: '',
                    type: null,
                    pol: 1,
                    element: ''
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Kontroll navn er påkrevd'),
                    type: Yup.string().required('Type er påkrevd')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    if (values.type !== null) {
                    }
                }}>
                {({ isSubmitting, setFieldValue, values }) => {
                    return (
                        <Form>
                            {measurementTypes && (
                                <div>
                                    <label htmlFor="type-select">Type</label>
                                    <Select
                                        inputId="type-select"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isSearchable
                                        onChange={(selected) => {
                                            if (selected !== null) {
                                                setFieldValue('type', selected);
                                                setType(selected.value);
                                            }
                                        }}
                                        value={values.type}
                                        name="user"
                                        options={options}
                                        autoFocus
                                    />
                                </div>
                            )}
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
                                            value={1}
                                            control={<Radio />}
                                            label="1 Pol"
                                        />
                                        <FormControlLabel
                                            value={2}
                                            control={<Radio />}
                                            label="2 Pol"
                                        />
                                        <FormControlLabel
                                            value={3}
                                            control={<Radio />}
                                            label="3 Pol"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            ) : (
                                <div />
                            )}
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="element"
                                label="Element"
                                name="element"
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
    } else {
        return <div>mangler options</div>;
    }
};
