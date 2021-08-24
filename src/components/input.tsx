import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiCheckbox from '@material-ui/core/Checkbox';
import MuiTextField from '@material-ui/core/TextField';
import React from 'react';
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
    readonly
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
    label: React.ReactNode;
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
