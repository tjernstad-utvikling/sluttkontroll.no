import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '../theme/makeStyles';

const useStyles = makeStyles()((theme: Theme) => ({
    wrapper: {
        position: 'relative'
    },
    buttonProgress: {
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
    const { classes, cx, css, theme } = useStyles();

    return (
        <div>
            {isLoading && (
                <LinearProgress
                    className={cx(
                        css({
                            marginBottom: theme.spacing(1)
                        })
                    )}
                    color="success"
                />
            )}
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
                        color="success"
                        className={classes.buttonProgress}
                    />
                )}
            </div>
        </div>
    );
};
