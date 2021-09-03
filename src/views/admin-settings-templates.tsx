import { Card, CardMenu } from '../components/card';
import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router';
import { useTemplate } from '../data/skjemaTemplate';

const SettingsView = () => {
    const classes = usePageStyles();

    const { path } = useRouteMatch();

    const {
        state: { templates },
        loadTemplates
    } = useTemplate();
    useEffectOnce(async () => {
        loadTemplates();
    });
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
                                            deleteTemplate: () =>
                                                console.log('kommer')
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
