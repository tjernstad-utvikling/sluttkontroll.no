import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { LoadingButton } from '../components/button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import { TextField } from '../components/input';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { makeStyles } from '../theme/makeStyles';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage: 'url(/images/front.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'grey',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    paper: {
        margin: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: '5px',
        backgroundColor: theme.palette.primary.main
    },
    form: {
        marginTop: '5px'
    },
    submit: {
        margin: '5px'
    },
    errorText: {
        color: theme.palette.error.main
    }
}));

const FrontPage = () => {
    const { classes, cx, css, theme } = useStyles();
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
                                const loginResponse = await signIn(
                                    values.email,
                                    values.password
                                );
                                if (loginResponse.status) {
                                    history.push(loginResponse.redirect);
                                } else {
                                    setLoginError(
                                        'Innlogging feilet, epost eller passord eksisterer ikke'
                                    );
                                }
                            } catch (error: any) {
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
                                {loginError !== undefined && (
                                    <Typography
                                        className={classes.errorText}
                                        component="div">
                                        {loginError}
                                    </Typography>
                                )}
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

                    <div
                        className={cx(
                            css({
                                position: 'fixed',
                                bottom: 0
                            })
                        )}>
                        <Typography
                            className={cx(
                                css({
                                    color: theme.palette.text.disabled,
                                    fontSize: '0.756rem'
                                })
                            )}>
                            Photo by{' '}
                            <a
                                className={cx(
                                    css({
                                        color: theme.palette.text.disabled
                                    })
                                )}
                                href="https://unsplash.com/@esptroy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                                Troy Bridges
                            </a>{' '}
                            on{' '}
                            <a
                                className={cx(
                                    css({
                                        color: theme.palette.text.disabled
                                    })
                                )}
                                href="https://unsplash.com/s/photos/electrical?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                                Unsplash
                            </a>
                        </Typography>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default FrontPage;
