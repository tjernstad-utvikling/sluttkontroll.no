// Import the styles

import '@react-pdf-viewer/core/lib/styles/index.css';

import {
    CalibrationTable,
    calibrationColumns,
    defaultColumns
} from '../tables/calibration';
import { Card, CardContent } from '../components/card';
import {
    useCalibrationByInstrument,
    useInstrument
} from '../api/hooks/useInstrument';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { InstrumentCalibrationViewParams } from '../contracts/navigation';
import { Kalibrering } from '../contracts/instrumentApi';
import { PdfViewer } from '../components/viewer';
import { TableContainer } from '../tables/base/tableContainer';
import { errorHandler } from '../tools/errorHandler';
import { getCalibrationCertificate } from '../api/instrumentApi';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const InstrumentsView = () => {
    const { classes } = usePageStyles();
    const { instrumentId } = useParams<InstrumentCalibrationViewParams>();

    const instrumentData = useInstrument({
        instrumentId: Number(instrumentId)
    });

    const calibrationData = useCalibrationByInstrument({
        instrumentId: Number(instrumentId)
    });

    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
    const [openCertificateId, setOpenCertificateId] = useState<number>();

    const openCertificate = async (calibration: Kalibrering) => {
        if (objectUrl !== undefined) {
            URL.revokeObjectURL(objectUrl);
        }
        setObjectUrl(undefined);
        setOpenCertificateId(undefined);
        try {
            const response = await getCalibrationCertificate(
                calibration.kalibreringSertifikat.fileName
            );

            if (response.status === 200 && response.data !== undefined) {
                const blob = new Blob([response.data]);

                setObjectUrl(URL.createObjectURL(blob));
                setOpenCertificateId(calibration.id);
            }
            if (response.status === 404) {
                enqueueSnackbar('Kalibreringssertifikat ikke funnet', {
                    variant: 'warning'
                });
            }
        } catch (error: any) {
            enqueueSnackbar('Ukjent problem med lasting av sertifikat', {
                variant: 'error'
            });
            errorHandler(error);
        }
    };

    const { enqueueSnackbar } = useSnackbar();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Kalibreringer">
                            <CardContent>
                                <TableContainer
                                    columns={calibrationColumns({
                                        openCertificate,
                                        openCertificateId,
                                        instrumentLastCalibration:
                                            instrumentData.data
                                                ?.sisteKalibrert ?? null
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="calibrations">
                                    <CalibrationTable
                                        isLoading={calibrationData.isLoading}
                                        calibrations={
                                            calibrationData.data ?? []
                                        }
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <PdfViewer
                        getFileName={() => {
                            if (instrumentData.data) {
                                return `${instrumentData.data.name}-${instrumentData.data.serienr}.pdf`;
                            }
                            return 'sertifikat.pdf';
                        }}
                        fileUrl={objectUrl}
                    />
                </Grid>
            </Container>
        </>
    );
};

export default InstrumentsView;
