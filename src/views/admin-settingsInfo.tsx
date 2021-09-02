import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const InfoTextView = () => {
    const classes = usePageStyles();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Sluttkontrollrapport informasjonstekst">
                            <div style={{ padding: 15 }}></div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default InfoTextView;
