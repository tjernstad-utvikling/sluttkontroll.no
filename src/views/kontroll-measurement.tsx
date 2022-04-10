import { Card, CardContent, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    MeasurementClipboard,
    PasteButton
} from '../components/clipboard';
import {
    MeasurementTable,
    columns,
    defaultColumns
} from '../tables/measurement';
import {
    useDeleteMeasurement,
    useMeasurementTypes,
    useMeasurements
} from '../api/hooks/useMeasurement';
import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { MeasurementModal } from '../modal/measurement';
import { MeasurementsViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useClipBoard } from '../data/clipboard';
import { useConfirm } from '../hooks/useConfirm';
import { useKontrollById } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useSkjemaer } from '../api/hooks/useSkjema';

const MeasurementsView = () => {
    const { classes } = usePageStyles();
    const { kontrollId, skjemaId } = useParams<MeasurementsViewParams>();

    const [measurementModalOpen, setMeasurementModalOpen] =
        useState<boolean>(false);

    const { confirm } = useConfirm();

    const [editId, setEditId] = useState<number>();

    const measurementData = useMeasurements({
        ...(skjemaId
            ? { skjemaId: Number(skjemaId) }
            : kontrollId
            ? { kontrollId: Number(kontrollId) }
            : {})
    });

    const deleteMeasurementMutation = useDeleteMeasurement();

    const mTypeData = useMeasurementTypes();

    const kontrollData = useKontrollById(Number(kontrollId));
    const skjemaData = useSkjemaer({ kontrollId: Number(kontrollId) });

    const deleteMeasurement = async (measurementId: number) => {
        const measurement = measurementData.data?.find(
            (m) => m.id === measurementId
        );
        if (measurement !== undefined && mTypeData.data !== undefined) {
            let mType = measurement.type;

            let type = mTypeData.data.find(
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
                `Slette (ID: ${measurement.id}) ${mType} ${
                    measurement.element
                } ${
                    measurement.resultat > 0 ? measurement.resultat / 100 : 0
                } ${measurement.enhet}?`
            );

            if (isConfirmed) {
                await deleteMeasurementMutation.mutateAsync({
                    measurementId,
                    skjemaId: measurement.skjema.id
                });
            }
        }
    };

    /**
     * Clipboard
     */
    const {
        state: { measurementToPast },
        openScissors,
        closeScissors,
        selectedMeasurements,
        clipboardHasMeasurement,
        clipboardHasKontroll
    } = useClipBoard();
    useEffect(() => {
        openScissors();
        return () => {
            closeScissors();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSelectForClipboard = (ids: number[]) => {
        if (measurementData.data)
            selectedMeasurements(
                measurementData.data.filter((measurement) => {
                    return ids.includes(measurement.id);
                })
            );
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={
                            clipboardHasMeasurement || clipboardHasKontroll
                                ? 9
                                : 12
                        }>
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
                            <CardContent>
                                <TableContainer
                                    columns={columns({
                                        kontroll: kontrollData.data,
                                        skjemaer: skjemaData.data ?? [],
                                        deleteMeasurement,
                                        edit: (id) => {
                                            setEditId(id);
                                            setMeasurementModalOpen(true);
                                        },
                                        measurementTypes: mTypeData.data
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="measurements">
                                    <MeasurementTable
                                        measurements={
                                            measurementData.data ?? []
                                        }
                                        isLoading={
                                            skjemaData.isLoading ||
                                            kontrollData.isLoading ||
                                            measurementData.isLoading
                                        }
                                        onSelected={onSelectForClipboard}
                                        leftAction={
                                            skjemaId !== undefined && (
                                                <PasteButton
                                                    clipboardHas={
                                                        clipboardHasMeasurement
                                                    }
                                                    options={{
                                                        measurementPaste: {
                                                            skjemaId:
                                                                Number(
                                                                    skjemaId
                                                                ),
                                                            measurement:
                                                                measurementToPast
                                                        }
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    {(clipboardHasMeasurement || clipboardHasKontroll) && (
                        <ClipboardCard>
                            {clipboardHasKontroll && <KontrollClipboard />}
                            {clipboardHasMeasurement && (
                                <MeasurementClipboard />
                            )}
                        </ClipboardCard>
                    )}
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
