import { Card, CardMenu } from '../components/card';
import { SkjemaTable, columns, defaultColumns } from '../tables/skjema';
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Skjema } from '../contracts/kontrollApi';
import { SkjemaerViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useAvvik } from '../data/avvik';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';

const SkjemaerView = () => {
    const classes = usePageStyles();
    const { kontrollId } = useParams<SkjemaerViewParams>();
    const { url } = useRouteMatch();

    const history = useHistory();

    const [_skjemaer, setSkjemaer] = useState<Array<Skjema>>([]);
    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    const {
        state: { avvik }
    } = useAvvik();

    const {
        state: { measurements }
    } = useMeasurement();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjemaer(
                skjemaer.filter((s) => s.kontroll.id === Number(kontrollId))
            );
        }
    }, [skjemaer, kontrollId]);

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Skjemaer"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt skjema',
                                            action: () =>
                                                history.push(
                                                    `/kontroll/${kontrollId}/skjema/new`
                                                )
                                        }
                                    ]}
                                />
                            }>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(
                                        kontroller ?? [],
                                        avvik ?? [],
                                        measurements ?? [],
                                        url
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="skjemaer">
                                    <SkjemaTable
                                        skjemaer={_skjemaer}
                                        kontroller={kontroller ?? []}
                                        avvik={avvik ?? []}
                                        measurements={measurements ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster skjemaer</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SkjemaerView;
