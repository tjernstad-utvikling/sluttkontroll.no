import { Card, CardMenu } from '../components/card';
import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router';
import { useTemplate } from '../data/skjemaTemplate';

const SettingsView = () => {
    const classes = usePageStyles();

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
                            <div style={{ padding: 15 }}>
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
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SettingsView;
