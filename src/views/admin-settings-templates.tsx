import { Card, CardContent, CardMenu } from '../components/card';
import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router';
import { useTemplate } from '../data/skjemaTemplate';

const SettingsView = () => {
    const { classes } = usePageStyles();

    const { path } = useRouteMatch();

    const { confirm } = useConfirm();

    const {
        state: { templates },
        loadTemplates,
        removeTemplate
    } = useTemplate();
    useEffectOnce(async () => {
        loadTemplates();
    });

    const askToDeleteTemplate = async (templateId: number) => {
        const template = templates?.find((t) => t.id === templateId);
        if (template !== undefined) {
            const isConfirmed = await confirm(
                `Slette sjekklistemal: ${template.id} - ${template.name}?`
            );

            if (isConfirmed) {
                removeTemplate(template);
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
                                {templates !== undefined ? (
                                    <TableContainer
                                        columns={columns({
                                            path,
                                            deleteTemplate: askToDeleteTemplate
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="skjemaTemplates">
                                        <TemplateTable templates={templates} />
                                    </TableContainer>
                                ) : (
                                    <div>Laster maler</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SettingsView;
