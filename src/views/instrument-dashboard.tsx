import { Card, CardMenu } from '../components/card';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHistory } from 'react-router-dom';
import { useInstrument } from '../data/instrument';
import { usePageStyles } from '../styles/kontroll/page';

const InstrumentsView = () => {
    const classes = usePageStyles();

    const history = useHistory();

    const {
        state: { instruments },
        loadInstruments
    } = useInstrument();

    useEffectOnce(() => {
        loadInstruments();
    });

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Dine kontroller"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Ny kontroll',
                                            action: () =>
                                                history.push('/kontroll/new')
                                        }
                                    ]}
                                />
                            }>
                            <p>Instruments here</p>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default InstrumentsView;
