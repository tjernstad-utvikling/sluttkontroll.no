import { Card, CardContent, CardMenu } from '../components/card';
import {
    FormsTemplateTable,
    columns,
    defaultColumns
} from '../tables/formsTemplate';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useForms } from '../data/forms';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router';

const FormsTemplatesView = () => {
    const { classes } = usePageStyles();

    const { path } = useRouteMatch();

    const {
        state: { templates },
        loadTemplates
    } = useForms();

    useEffectOnce(() => {
        loadTemplates();
    });

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Risikovurdering maler"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Ny  mal',
                                            to: '/admin/settings/forms/new'
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                {templates !== undefined ? (
                                    <TableContainer
                                        columns={columns({ path })}
                                        defaultColumns={defaultColumns}
                                        tableId="formsTemplates">
                                        <FormsTemplateTable
                                            templates={templates}
                                        />
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

export default FormsTemplatesView;
