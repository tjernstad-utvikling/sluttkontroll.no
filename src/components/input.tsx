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
import Select from 'react-select';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { makeStyles } from '../theme/makeStyles';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [field, meta, helpers] = useField(name);

    const { value } = meta;
    const { setValue } = helpers;
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={nbLocale}>
            <DatePicker
                clearable
                label={label}
                value={value}
                onChange={(date) => setValue(date)}
                renderInput={(params) => (
                    <MuiTextField
                        {...params}
                        margin="normal"
                        error={meta.touched && meta.error ? true : false}
                        helperText={meta.error}
                    />
                )}
            />
        </LocalizationProvider>
    );
};

interface Data {
    label: string;
}
interface SelectFieldProps<T> {
    id: string;
    label: React.ReactNode;
    name: string;
    options: T[];
    isMulti?: boolean | undefined;
    selectCallBack?: (val: T) => void;
}
export const SelectField = <T extends Data>({
    id,
    label,
    options,
    name,
    isMulti,
    selectCallBack
}: SelectFieldProps<T>) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta, helpers] = useField(name);

    const { classes } = useStyles();

    const { setValue } = helpers;

    return (
        <div style={{ paddingBottom: 10 }}>
            <label id="aria-label" htmlFor={id}>
                {label}
            </label>
            <Select
                aria-labelledby="aria-label"
                inputId={id}
                className="basic-single"
                classNamePrefix="select"
                value={field.value}
                onChange={(selected) => {
                    if (selected !== null) {
                        setValue(selected);
                        if (selectCallBack) {
                            selectCallBack(selected as T);
                        }
                    }
                }}
                name="type"
                options={options}
                isMulti={isMulti}
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                    }),
                    multiValue: (styles, { isDisabled, isFocused }) => {
                        return {
                            ...styles,
                            backgroundColor: isDisabled ? undefined : '#1A4D27'
                        };
                    },
                    option: (styles, { isDisabled, isFocused, isSelected }) => {
                        return {
                            ...styles,
                            backgroundColor: isDisabled
                                ? undefined
                                : isSelected
                                ? '#1A4D27'
                                : isFocused
                                ? '#267339'
                                : undefined,
                            color: isDisabled
                                ? undefined
                                : isSelected
                                ? '#ffffff'
                                : isFocused
                                ? '#2a2a2a'
                                : undefined,

                            ':active': {
                                ...styles[':active'],
                                backgroundColor: !isDisabled
                                    ? isSelected
                                        ? '#1A4D27'
                                        : '#267339'
                                    : undefined
                            }
                        };
                    }
                }}
                menuPortalTarget={document.body}
            />
            {meta.touched && meta.error && (
                <Typography className={classes.error}>{meta.error}</Typography>
            )}
        </div>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    error: {
        color: theme.palette.error.main
    }
}));
