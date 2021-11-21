import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiTextField from '@mui/material/TextField';
import React from 'react';
import nbLocale from 'date-fns/locale/nb';
import { useField } from 'formik';

interface TextFieldProps {
    id: string;
    label: React.ReactNode;
    variant?: 'outlined' | 'standard' | 'filled';
    required?: boolean;
    fullWidth?: boolean;
    name: string;
    autoComplete?: string;
    autoFocus?: boolean;
    type?: string;
    readonly?: boolean;
    multiline?: boolean;
}
export const TextField = ({
    id,
    label,
    variant,
    fullWidth,
    name,
    autoComplete,
    autoFocus,
    type,
    readonly,
    multiline
}: TextFieldProps) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField({ name, type });

    return (
        <>
            <MuiTextField
                {...field}
                variant={variant}
                margin="normal"
                fullWidth={fullWidth}
                multiline={multiline}
                id={id}
                label={label}
                name={name}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                type={type}
                error={meta.touched && meta.error ? true : false}
                helperText={meta.error}
                InputProps={{ readOnly: readonly }}
            />
        </>
    );
};

interface CheckboxProps {
    label: string;
    name: string;
}
export const Checkbox = ({ label, name }: CheckboxProps) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField({ name, type: 'checkbox' });
    return (
        <FormControl
            required
            error={meta.touched && meta.error ? true : false}
            component="fieldset">
            <FormGroup>
                <FormControlLabel
                    control={<MuiCheckbox {...field} color="primary" />}
                    label={label}
                />
            </FormGroup>
            <FormHelperText>{meta.error}</FormHelperText>
        </FormControl>
    );
};

interface DateInputProps {
    label: string;
    name: string;
}
export const DateInput = ({ label, name }: DateInputProps) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField({ name, type: 'text' });
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={nbLocale}>
            <DatePicker
                clearable
                label={label}
                value={newCalibrationDate}
                onChange={(date) => setNewCalibrationDate(date)}
                renderInput={(params) => <MuiTextField {...params} />}
            />
        </LocalizationProvider>
    );
};
