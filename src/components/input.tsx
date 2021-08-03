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
