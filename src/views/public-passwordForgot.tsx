import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from '@mui/material/Link';
import { LoadingButton } from '../components/button';
import Paper from '@mui/material/Paper';
import { TextField } from '../components/input';
import Typography from '@mui/material/Typography';
import { postForgotEmail } from '../api/authApi';
import { useFrontStyles } from '../styles/public/front';

const ForgotPasswordPage = () => {
    const { classes, cx, css, theme } = useFrontStyles();

    const history = useHistory();

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
                        <HelpOutlineIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Glemt passord
                    </Typography>
                    <Formik
                        initialValues={{
                            email: ''
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Epost er ugyldig')
                                .required('Epost er påkrevd')
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const { status } = await postForgotEmail(
                                    values.email
                                );
                                if (status === 204) {
                                    history.push('/password/reset');
                                }
                            } catch (error: any) {}
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

                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}>
                                    Send
                                </LoadingButton>
                                <Grid container>
                                    <Grid item xs>
                                        <Link
                                            component={RouterLink}
                                            to="/"
                                            variant="body2">
                                            Logg inn
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

export default ForgotPasswordPage;
