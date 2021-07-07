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

interface KontrollSchemaProps {}
export const KontrollSchema = ({}: KontrollSchemaProps): JSX.Element => {
    return (
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
            onSubmit={async (values, { setSubmitting }) => {}}>
            {({ isSubmitting }) => (
                <Form>
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

                    <LoadingButton
                        isLoading={isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary">
                        Logg inn
                    </LoadingButton>
                </Form>
            )}
        </Formik>
    );
};
