import { Card, CardMenu } from '../components/card';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const FormsTemplatesView = () => {
    const classes = usePageStyles();

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
                                            to: '/admin/settings/forms'
                                        }
                                    ]}
                                />
                            }>
                            <div style={{ padding: 15 }}></div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default FormsTemplatesView;
