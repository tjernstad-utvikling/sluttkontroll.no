import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { Theme } from '@mui/material';
import { green } from '@mui/material/colors';
import { makeStyles } from '../theme/makeStyles';

const useStyles = makeStyles()((theme: Theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative'
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
}));

interface LoadingButtonProps {
    isLoading: boolean;
    variant?: 'text' | 'outlined' | 'contained';
    color?:
        | 'error'
        | 'success'
        | 'warning'
        | 'info'
        | 'inherit'
        | 'primary'
        | 'secondary'
        | undefined;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullWidth?: boolean | undefined;
}
export const LoadingButton = ({
    isLoading,
    variant,
    color,
    className,
    onClick,
    children,
    type,
    fullWidth
}: LoadingButtonProps) => {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Button
                type={type}
                fullWidth={fullWidth}
                variant={variant}
                color={color}
                className={className}
                disabled={isLoading}
                onClick={onClick}>
                {children}
            </Button>
            {isLoading && (
                <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                />
            )}
        </div>
    );
};
