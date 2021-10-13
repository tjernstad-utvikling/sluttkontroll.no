import { Card, CardMenu } from '../components/card';
import {
    MeasurementTable,
    columns,
    defaultColumns
} from '../tables/measurement';
import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Measurement } from '../contracts/measurementApi';
import { MeasurementModal } from '../modal/measurement';
import { MeasurementsViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const MeasurementsView = () => {
    const { classes } = usePageStyles();
    const { kontrollId, skjemaId } = useParams<MeasurementsViewParams>();

    const [_measurements, setMeasurements] = useState<Array<Measurement>>([]);
    const [measurementModalOpen, setMeasurementModalOpen] =
        useState<boolean>(false);
    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    const { confirm } = useConfirm();

    const [editId, setEditId] = useState<number>();

    const {
        state: { measurements, measurementTypes },
        removeMeasurement
    } = useMeasurement();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (measurements !== undefined) {
            if (skjemaId !== undefined) {
                setMeasurements(
                    measurements.filter((m) => m.skjema.id === Number(skjemaId))
                );
            } else {
                setMeasurements(
                    measurements.filter(
                        (m) => m.skjema.kontroll.id === Number(kontrollId)
                    )
                );
            }
        }
    }, [skjemaId, measurements, kontrollId]);

    const deleteMeasurement = async (measurementId: number) => {
        const measurement = measurements?.find((m) => m.id === measurementId);
        if (measurement !== undefined && measurementTypes !== undefined) {
            let mType = measurement.type;

            let type = measurementTypes.find(
                (type) => type.shortName === measurement.type
            );
            if (type) {
                if (type.hasPol) {
                    mType = type.longName.replace('#', measurement.pol + 'p');
                } else {
                    mType = type.longName;
                }
            }
            const isConfirmed = await confirm(
                `Slette (ID: ${measurement.id}) ${mType} ${measurement.element} ${measurement.resultat} ${measurement.enhet}?`
            );

            if (isConfirmed) {
                removeMeasurement(measurementId);
            }
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Målinger"
                            menu={
                                skjemaId !== undefined && (
                                    <CardMenu
                                        items={[
                                            {
                                                label: 'Ny måling',
                                                action: () =>
                                                    setMeasurementModalOpen(
                                                        true
                                                    )
                                            }
                                        ]}
                                    />
                                )
                            }>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(
                                        kontroller ?? [],
                                        skjemaer ?? [],
                                        deleteMeasurement,
                                        (id) => {
                                            setEditId(id);
                                            setMeasurementModalOpen(true);
                                        }
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
            <MeasurementModal
                open={measurementModalOpen}
                close={() => {
                    setMeasurementModalOpen(!measurementModalOpen);
                    setEditId(undefined);
                }}
                skjemaId={Number(skjemaId)}
                editId={editId}
            />
        </div>
    );
};

export default MeasurementsView;
