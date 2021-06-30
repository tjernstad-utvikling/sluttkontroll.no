import MuiTextField from '@material-ui/core/TextField';
import { PropTypes } from '@material-ui/core';
import { useValidation } from './formContainer';

interface TextFieldProps {
    id: string;
    label: React.ReactNode;
    helperText?: React.ReactNode;
    margin?: PropTypes.Margin;
    variant?: 'outlined' | 'standard' | 'filled';
    onChange: (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
    value?: string | number | undefined;
    required?: boolean;
    fullWidth?: boolean;
    name?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    type?: string;
}
export const TextField = ({
    id,
    label,
    helperText,
    margin,
    variant,
    value,
    onChange,
    required,
    fullWidth,
    name,
    autoComplete,
    autoFocus,
    type
}: TextFieldProps) => {
    const { setInput } = useValidation();

    const validate = () => {
        setInput({ key: id, status: true });
    };
    return (
        <MuiTextField
            error
            id={id}
            label={label}
            helperText={helperText}
            variant={variant}
            margin={margin}
            value={value}
            onChange={onChange}
            onBlur={validate}
            required={required}
            fullWidth={fullWidth}
            name={name}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            type={type}
        />
    );
};
