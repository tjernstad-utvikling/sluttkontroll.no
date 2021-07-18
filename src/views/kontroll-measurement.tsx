import { Card, CardMenu } from '../components/card';
import {
    MeasurementTable,
    columns,
    defaultColumns
} from '../tables/measurement';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Measurement } from '../contracts/measurementApi';
import { MeasurementsViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';

const MeasurementsView = () => {
    const classes = usePageStyles();
    const { kontrollId, skjemaId } = useParams<MeasurementsViewParams>();

    const history = useHistory();

    const [_measurements, setMeasurements] = useState<Array<Measurement>>([]);
    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    const {
        state: { measurements }
    } = useMeasurement();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (measurements !== undefined) {
            if (skjemaId !== undefined) {
                setMeasurements(
                    measurements.filter((m) => m.Skjema.id === Number(skjemaId))
                );
            } else {
                setMeasurements(
                    measurements.filter(
                        (m) => m.Skjema.kontroll.id === Number(kontrollId)
                    )
                );
            }
        }
    }, [skjemaId, measurements, kontrollId]);

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
                                            label: 'Ny måling (kommer)',
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
                                        skjemaer ?? []
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="measurements">
                                    <MeasurementTable
                                        skjemaer={skjemaer}
                                        kontroller={kontroller ?? []}
                                        measurements={_measurements ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster målinger</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default MeasurementsView;
