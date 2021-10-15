import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import {
    FormsField,
    FormsFieldTypeEnum,
    formsFieldTypeOption
} from '../contracts/sjaApi';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Select from 'react-select';
import { TextField } from '../components/input';
import { useCreateForm } from '../components/forms';
import { useMemo } from 'react';

// id: number;
// title: string;
// type: FieldTypeEnum;
// textChoices?: Array<string>;
// objectChoices?: Array<ObjectChoiceType>;
// objectTitle?: string;

interface FormsTemplateFieldSchemaProps {
    field?: FormsField;
    onSubmit: (title: string, type: FormsFieldTypeEnum) => Promise<boolean>;
    goBack: () => void;
}
export const FormsTemplateFieldSchema = ({
    field,
    onSubmit,
    goBack
}: FormsTemplateFieldSchemaProps): JSX.Element => {
    const { setSelectedGroup } = useCreateForm();

    const selectedType = useMemo(() => {
        let preSelectedType = FormsFieldTypeEnum.info;
        if (field !== undefined) {
            preSelectedType = field.type;
        }
        const option = formsFieldTypeOption?.find(
            (o) => o.value === preSelectedType
        );
        if (option !== undefined) {
            return option;
        }
        return null;
    }, [field]);

    return (
        <Formik
            initialValues={{
                title: field?.title || '',
                type: selectedType
            }}
            enableReinitialize
            validationSchema={Yup.object({
                title: Yup.string().required('Tittel er påkrevd'),
                type: Yup.string().required('Felt type er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (values.type?.value !== undefined) {
                    if (await onSubmit(values.title, values.type?.value)) {
                        resetForm();
                    }
                }
            }}>
            {({ isSubmitting, setFieldValue, values, resetForm }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="title"
                            label="Tittel"
                            name="title"
                            autoFocus
                        />
                        <label htmlFor="type-select">Type</label>
                        <Select
                            inputId="type-select"
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable
                            onChange={(selected) => {
                                if (selected !== null) {
                                    setFieldValue('type', selected);
                                }
                            }}
                            value={values.type}
                            name="user"
                            options={formsFieldTypeOption}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                            menuPortalTarget={document.body}
                        />
                        <ButtonGroup fullWidth>
                            <Button onClick={goBack}>Tilbake</Button>
                            {field && (
                                <Button
                                    color="warning"
                                    variant="contained"
                                    onClick={() => {
                                        resetForm();
                                        setSelectedGroup(undefined);
                                    }}>
                                    Legg til ny
                                </Button>
                            )}
                            <MuiLoadingButton
                                loading={isSubmitting}
                                type="submit"
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained">
                                Lagre
                            </MuiLoadingButton>
                        </ButtonGroup>
                    </Form>
                );
            }}
        </Formik>
    );
};
