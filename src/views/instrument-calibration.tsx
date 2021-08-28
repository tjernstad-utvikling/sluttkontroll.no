import {
    CalibrationTable,
    calibrationColumns,
    defaultColumns
} from '../tables/calibration';
import { useEffect, useState } from 'react';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { InstrumentCalibrationViewParams } from '../contracts/navigation';
import { Kalibrering } from '../contracts/instrumentApi';
import { TableContainer } from '../tables/tableContainer';
import { getCalibrationsByInstrument } from '../api/instrumentApi';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const InstrumentsView = () => {
    const classes = usePageStyles();
    const { instrumentId } = useParams<InstrumentCalibrationViewParams>();

    const [_calibrations, setCalibrations] = useState<Kalibrering[]>();
    const [loadedInstrumentId, setLoadedInstrumentId] = useState<number>();

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const get = async () => {
            const { calibrations, status } = await getCalibrationsByInstrument(
                Number(instrumentId)
            );
            if (status === 200) {
                setCalibrations(calibrations);
                setLoadedInstrumentId(Number(instrumentId));
            } else if (status === 400) {
                enqueueSnackbar('Ingen kalibreringer funnet', {
                    variant: 'warning'
                });
            }
        };
        if (Number(instrumentId) !== loadedInstrumentId) get();
    }, [enqueueSnackbar, instrumentId, loadedInstrumentId]);

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Kalibreringer">
                            {_calibrations !== undefined ? (
                                <TableContainer
                                    columns={calibrationColumns({
                                        openCertificate: 0
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="instruments">
                                    <CalibrationTable
                                        calibrations={_calibrations ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster kalibreringer</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default InstrumentsView;
