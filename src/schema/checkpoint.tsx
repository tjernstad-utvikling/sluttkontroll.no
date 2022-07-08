import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { SelectField, TextField } from '../components/input';
import { useEffect, useMemo, useState } from 'react';

import { Checkpoint } from '../contracts/checkpointApi';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import { categories } from '../utils/checkpointCategories.json';

interface Option {
    value: string | number;
    label: string;
}

interface FormValues {
    type: Option | null;
    prosedyre: string;
    prosedyreNr: string;
    tekst: string;
    mainCategory: Option | null;
    groupCategory: Option | null;
}

interface CheckpointSchemaProps {
    checkpoint?: Checkpoint | undefined;
    onSubmit: (
        prosedyre: string,
        prosedyreNr: string,
        tekst: string,
        gruppe: string
    ) => Promise<boolean>;
}

export const CheckpointSchema = ({
    checkpoint,
    onSubmit
}: CheckpointSchemaProps): JSX.Element => {
    const [mainOptions, setMainOptions] = useState<
        {
            value: string;
            label: string;
        }[]
    >();

    useEffect(() => {
        setMainOptions(
            categories.map((c) => {
                return { value: c.key, label: c.name };
            })
        );
    }, []);

    const mainOption =
        checkpoint !== undefined
            ? mainOptions?.find((mo) => mo.value === checkpoint.mainCategory)
            : null;

    const selectedGroup = useMemo(() => {
        const mainCategory = categories.find(
            (c) => c.key === checkpoint?.mainCategory
        );

        const group = mainCategory?.groups.find(
            (g) => g.key === checkpoint?.groupCategory
        );
        if (group !== undefined) {
            return { value: group.key, label: group.name };
        }
        return null;
    }, [checkpoint?.groupCategory, checkpoint?.mainCategory]);

    return (
        <Formik
            initialValues={{
                prosedyre: checkpoint?.prosedyre || '',
                prosedyreNr: checkpoint?.prosedyreNr || '',
                tekst: checkpoint?.tekst || '',
                mainCategory: mainOption || null,
                groupCategory: selectedGroup
            }}
            validationSchema={Yup.object({
                prosedyre: Yup.string().required('Prosedyre er påkrevd'),
                prosedyreNr: Yup.string().required('Prosedyre nr er påkrevd'),
                tekst: Yup.string().required('Avvikstekst er påkrevd'),
                mainCategory: new Yup.MixedSchema().required(
                    'Kategori er påkrevd'
                )
            })}
            onSubmit={async (values, { setSubmitting }) => {
                if (values.mainCategory !== null) {
                    await onSubmit(
                        values.prosedyre,
                        values.prosedyreNr,
                        values.tekst,
                        values.mainCategory.value
                    );
                }
            }}>
            {({ isSubmitting, setFieldValue, values, errors, touched }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <SelectField
                                    id="mainCategory"
                                    label="Kategori"
                                    name="mainCategory"
                                    options={mainOptions ?? []}
                                />
                            </Grid>
                            {values.mainCategory !== null && (
                                <>
                                    <Grid item xs={12}>
                                        <GroupField />
                                    </Grid>
                                    {values.groupCategory !== null && (
                                        <>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="prosedyreNr"
                                                    label="Prosedyre nummer"
                                                    name="prosedyreNr"
                                                    autoFocus
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={9}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="prosedyre"
                                                    label="Prosedyre"
                                                    name="prosedyre"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    id="tekst"
                                                    label="Avvikstekst"
                                                    name="tekst"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LoadingButton
                                                    isLoading={isSubmitting}
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary">
                                                    Lagre
                                                </LoadingButton>
                                            </Grid>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

const GroupField = () => {
    const {
        values: { mainCategory },
        setFieldValue
    } = useFormikContext<FormValues>();

    const [groupOptions, setGroupOptions] = useState<
        {
            value: number;
            label: string;
        }[]
    >();

    useEffect(() => {
        if (mainCategory !== null) {
            const main = categories.find((c) => c.key === mainCategory.value);

            setFieldValue('groupCategory', null);

            setGroupOptions(
                main?.groups.map((g) => {
                    return { value: g.key, label: g.name };
                })
            );
        }
    }, [mainCategory, setFieldValue]);

    return (
        <SelectField
            id="groupCategory"
            label="Gruppe"
            name="groupCategory"
            options={groupOptions ?? []}
        />
    );
};
