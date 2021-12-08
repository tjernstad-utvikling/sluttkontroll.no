import * as Yup from 'yup';

import { DateInput, TextField } from '../components/input';
import { Form, Formik } from 'formik';

import { LoadingButton } from '../components/button';
import { ReportSetting } from '../contracts/reportApi';

interface ReportSettingsSchemaProps {
    onSubmit: (reportSetting: ReportSetting) => void;
    reportSetting: ReportSetting;
}
export const ReportSettingsSchema = ({
    onSubmit,
    reportSetting
}: ReportSettingsSchemaProps): JSX.Element => {
    return (
        <Formik
            initialValues={{
                reportTitle: reportSetting.reportTitle || '',
                reportSite: reportSetting.reportSite || '',
                reportDate: reportSetting.reportDate || ''
            }}
            validationSchema={Yup.object({
                reportTitle: Yup.string().required('Tittel er påkrevd'),
                reportSite: Yup.string().required('Kontrollsted er påkrevd'),
                reportDate: Yup.string().required('Dato er påkrevd')
            })}
            onSubmit={async (values, { setSubmitting }) => {
                onSubmit({ ...reportSetting, ...values });
            }}>
            {({ isSubmitting, setFieldValue, values }) => {
                return (
                    <Form>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="reportTitle"
                            label="Tittel"
                            name="reportTitle"
                        />

                        <TextField
                            variant="outlined"
                            fullWidth
                            id="reportSite"
                            label="Kontrollsted"
                            name="reportSite"
                        />

                        <DateInput label="Rapport dato" name="reportDate" />

                        <LoadingButton
                            isLoading={isSubmitting}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary">
                            Lagre
                        </LoadingButton>
                    </Form>
                );
            }}
        </Formik>
    );
};
