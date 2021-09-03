import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useTemplate } from '../data/skjemaTemplate';

const SettingsView = () => {
    const classes = usePageStyles();

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
                        <Card title="Sjekkliste maler">
                            <div style={{ padding: 15 }}>
                                {templates !== undefined ? (
                                    <TableContainer
                                        columns={columns({
                                            edit: () => console.log('kommer'),
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
