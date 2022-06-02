import { Card, CardContent, CardMenu } from '../components/card';
import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';
import {
    useRemoveTemplate,
    useTemplates
} from '../api/hooks/useSkjemaTemplate';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/base/tableContainer';
import { useConfirm } from '../hooks/useConfirm';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router';

const SettingsView = () => {
    const { classes } = usePageStyles();

    const { path } = useRouteMatch();

    const { confirm } = useConfirm();

    const removeTemplateMutation = useRemoveTemplate();

    const templateData = useTemplates();

    const askToDeleteTemplate = async (templateId: number) => {
        const template = templateData.data?.find((t) => t.id === templateId);
        if (template !== undefined) {
            const isConfirmed = await confirm(
                `Slette sjekklistemal: ${template.id} - ${template.name}?`
            );

            if (isConfirmed) {
                try {
                    await removeTemplateMutation.mutateAsync({
                        templateId: template.id
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Sjekkliste maler"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Ny  mal',
                                            to: '/admin/settings/template/new'
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <TableContainer
                                    columns={columns({
                                        path,
                                        deleteTemplate: askToDeleteTemplate
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="skjemaTemplates">
                                    <TemplateTable
                                        isLoading={templateData.isLoading}
                                        templates={templateData.data ?? []}
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SettingsView;
