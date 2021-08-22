import { Card, CardMenu } from '../components/card';
import {
    InstrumentTable,
    defaultColumns,
    instrumentColumns
} from '../tables/instrument';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
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
                            title="Instrumenter"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt instrument',
                                            action: () =>
                                                history.push('/kontroll/new')
                                        }
                                    ]}
                                />
                            }>
                            {instruments !== undefined ? (
                                <TableContainer
                                    columns={instrumentColumns((id: number) =>
                                        console.log(id)
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="instruments">
                                    <InstrumentTable
                                        instruments={instruments ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster instrumenter</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default InstrumentsView;
