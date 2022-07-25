import * as Yup from 'yup';

import { Form, Formik, useFormikContext } from 'formik';
import { SelectField, TextField } from '../components/input';
import { useEffect, useMemo, useState } from 'react';

import { Checkpoint } from '../contracts/checkpointApi';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { LoadingButton } from '../components/button';
import { Typography } from '@mui/material';
import { categories } from '../utils/checkpointCategories.json';
import { useCheckpoints } from '../api/hooks/useCheckpoint';

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
    checkpointNumber: number;
}

interface CheckpointSchemaProps {
    checkpoint?: Checkpoint | undefined;
    onSubmit: (saveValues: {
        prosedyre: string;
        prosedyreNr: string;
        tekst: string;
        mainCategory: string;
        groupCategory: number;
        checkpointNumber: number;
    }) => Promise<boolean>;
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
            ? {
                  value: checkpoint.mainCategory,
                  label: categories?.find(
                      (cat) => cat.key === checkpoint.mainCategory
                  )?.name
              }
            : null;

    const selectedGroup = useMemo(() => {
        const mainCategory = categories.find(
            (c) => c.key === checkpoint?.mainCategory
        );

        const group = mainCategory?.groups.find(
            (g) => g.key === checkpoint?.groupCategory
        );
        if (group) {
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
                groupCategory: Number(selectedGroup),
                checkpointNumber: Number(checkpoint?.checkpointNumber) || 1
            }}
            enableReinitialize
            validationSchema={Yup.object({
                prosedyre: Yup.string().required('Prosedyre er påkrevd'),
                prosedyreNr: Yup.string().required('Prosedyre nr er påkrevd'),
                tekst: Yup.string().required('Avvikstekst er påkrevd'),
                mainCategory: new Yup.MixedSchema().required(
                    'Kategori er påkrevd'
                ),
                groupCategory: new Yup.MixedSchema().required(
                    'Gruppe er påkrevd'
                ),
                checkpointNumber: Yup.number().required(
                    'Sjekkpunkt nummer er påkrevd'
                )
            })}
            onSubmit={async (values, { setSubmitting }) => {
                if (
                    values.mainCategory !== null &&
                    values.groupCategory !== null
                ) {
                    await onSubmit({
                        ...values,
                        mainCategory: values.mainCategory.value,
                        groupCategory: values.groupCategory.value,
                        checkpointNumber: values.checkpointNumber
                    });
                }
            }}>
            {({ isSubmitting, setFieldValue, values, errors, touched }) => {
                return (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid container item xs={6}>
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
                                            <GroupField
                                                mainCategoryToEdit={
                                                    checkpoint?.mainCategory ??
                                                    ''
                                                }
                                            />
                                        </Grid>
                                        {values.groupCategory !== null && (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="checkpointNumber"
                                                        label="Sjekkpunkt nummer"
                                                        name="checkpointNumber"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <ProsedyreNrField />
                                                </Grid>
                                                <Grid item xs={12}>
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
                            <Grid container item xs={6}>
                                <CheckpointGroupList
                                    checkpointNumberToEdit={
                                        checkpoint?.checkpointNumber
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

const ProsedyreNrField = () => {
    const {
        values: { mainCategory, groupCategory, checkpointNumber },
        setFieldValue
    } = useFormikContext<FormValues>();

    useEffect(() => {
        if (mainCategory !== null && groupCategory !== null) {
            setFieldValue(
                'prosedyreNr',
                `${mainCategory.value}.${groupCategory.value}.${checkpointNumber}`
            );
        }
    }, [checkpointNumber, groupCategory, mainCategory, setFieldValue]);

    return (
        <TextField
            variant="outlined"
            fullWidth
            id="prosedyreNr"
            label="Prosedyre nr"
            name="prosedyreNr"
            autoFocus
        />
    );
};

interface GroupFieldProps {
    mainCategoryToEdit: string;
}
const GroupField = ({ mainCategoryToEdit }: GroupFieldProps) => {
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

            if (mainCategoryToEdit !== main?.key)
                setFieldValue('groupCategory', null);

            setGroupOptions(
                main?.groups.map((g) => {
                    return { value: g.key, label: g.name };
                })
            );
        }
    }, [mainCategory, mainCategoryToEdit, setFieldValue]);

    return (
        <SelectField
            id="groupCategory"
            label="Gruppe"
            name="groupCategory"
            options={groupOptions ?? []}
        />
    );
};

interface CheckpointGroupListProps {
    checkpointNumberToEdit: number | undefined;
}

const CheckpointGroupList = ({
    checkpointNumberToEdit
}: CheckpointGroupListProps) => {
    const {
        values: { groupCategory, mainCategory },
        setFieldValue
    } = useFormikContext<FormValues>();

    const checkpointData = useCheckpoints();

    const groupCheckpoints = useMemo(() => {
        if (groupCategory !== null) {
            return checkpointData.data?.filter((c) => {
                return (
                    c.groupCategory === groupCategory.value &&
                    c.mainCategory === mainCategory?.value
                );
            });
        }
        return undefined;
    }, [checkpointData.data, groupCategory, mainCategory?.value]);

    useEffect(() => {
        if (
            mainCategory !== null &&
            groupCategory !== null &&
            !checkpointNumberToEdit
        ) {
            const numbers = groupCheckpoints?.map((gc) => gc.checkpointNumber);
            if (numbers && numbers.length > 0) {
                setFieldValue('checkpointNumber', Math.max(...numbers) + 1);
            } else {
                setFieldValue('checkpointNumber', 1);
            }
        }
    }, [
        checkpointNumberToEdit,
        groupCategory,
        groupCheckpoints,
        mainCategory,
        setFieldValue
    ]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" component="h3">
                Andre sjekkpunkter i valgt gruppe
            </Typography>
            <List>
                {groupCheckpoints?.map((gc) => (
                    <div key={gc.id}>
                        <ListItem disablePadding>
                            <ListItemText
                                primary={`${gc.prosedyreNr} - ${gc.prosedyre}`}
                            />
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
        </div>
    );
};
