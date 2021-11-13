import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from '@mui/material/Link';
import { LoadingButton } from '../components/button';
import Paper from '@mui/material/Paper';
import { PasswordResetViewParams } from '../contracts/navigation';
import { TextField } from '../components/input';
import Typography from '@mui/material/Typography';
import { postNewEmail } from '../api/auth';
import { useFrontStyles } from '../styles/public/front';

const PasswordResetPage = () => {
    const { classes, cx, css, theme } = useFrontStyles();
    const { token } = useParams<PasswordResetViewParams>();
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
                        Resett passord
                    </Typography>
                    <Formik
                        initialValues={{
                            password: '',
                            token: token || ''
                        }}
                        validationSchema={Yup.object({
                            password: Yup.string().required('Påkrevd')
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const { status } = await postNewEmail(
                                    values.password,
                                    values.token
                                );
                                if (status === 204) {
                                    history.push('/');
                                }
                            } catch (error: any) {}
                        }}>
                        {({ isSubmitting }) => (
                            <Form className={classes.form}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Nytt passord"
                                    name="password"
                                    autoFocus
                                    type="password"
                                />
                                {token === undefined && (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="token"
                                        label="Kode fra epost"
                                        name="token"
                                    />
                                )}

                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}>
                                    Lagre nytt passord
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

export default PasswordResetPage;
