import { Card, CardContent } from '../components/card';
import { FormsTable, columns, defaultColumns } from '../tables/forms';
import { getFormsByCurrentUser, getFormsDocument } from '../api/formsApi';

import Container from '@mui/material/Container';
import { Forms } from '../contracts/formsApi';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const FormsView = () => {
    const { classes } = usePageStyles();

    const [forms, setForms] = useState<Forms[]>();

    useEffectOnce(async () => {
        try {
            const res = await getFormsByCurrentUser();
            if (res.status === 200) {
                setForms(res.forms);
            }
        } catch (error: any) {
            console.error(error);
        }
    });

    const onDownloadForm = async (formId: number) => {
        const form = forms?.find((f) => f.id === formId);
        const identification = form?.sjaFormFields.find(
            (ff) => ff.field.id === form.template.listIdentificationField.id
        );
        try {
            const response = await getFormsDocument(formId);

            const fileURL = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute(
                'download',
                `Skjema-${identification?.text || ''}.pdf`
            );
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (error) {}
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Utfylte skjemaer">
                            <CardContent>
                                {forms !== undefined ? (
                                    <TableContainer
                                        columns={columns({
                                            onDownloadForm
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="forms">
                                        <FormsTable forms={forms} />
                                    </TableContainer>
                                ) : (
                                    <div>Laster skjemaer</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default FormsView;
