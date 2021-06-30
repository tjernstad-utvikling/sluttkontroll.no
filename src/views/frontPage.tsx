import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { LoadingButton } from '../components/button';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { TextField } from '../components/input';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    errorText: {
        color: theme.palette.error.main
    }
}));

export const FrontPage = () => {
    const classes = useStyles();
    const { signIn } = useAuth();

    const history = useHistory();

    const [loginError, setLoginError] = useState<string>();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={12} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Logg inn
                    </Typography>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Epost er ugyldig')
                                .required('Epost er påkrevd'),
                            password: Yup.string().required('Påkrevd')
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                if (
                                    await signIn(values.email, values.password)
                                ) {
                                    history.push('/kontroll');
                                } else {
                                    setLoginError(
                                        'Innlogging feilet, epost eller passord eksisterer ikke'
                                    );
                                }
                            } catch (error) {
                                setLoginError(
                                    'Innlogging feilet, en ukjent feil oppsto'
                                );
                            }
                        }}>
                        {({ isSubmitting }) => (
                            <Form className={classes.form}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Epost"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    type="email"
                                />

                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="password"
                                    label="Passord"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                {loginError !== undefined ? (
                                    <Typography
                                        className={classes.errorText}
                                        component="span">
                                        {loginError}
                                    </Typography>
                                ) : undefined}
                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}>
                                    Logg inn
                                </LoadingButton>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Glemt passord?
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Grid>
        </Grid>
    );
};
