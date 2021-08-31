// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

import {
    CalibrationTable,
    calibrationColumns,
    defaultColumns
} from '../tables/calibration';
import { Instrument, Kalibrering } from '../contracts/instrumentApi';
import {
    getCalibrationCertificate,
    getCalibrationsByInstrument
} from '../api/instrumentApi';
import { useEffect, useState } from 'react';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { InstrumentCalibrationViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { useInstrument } from '../data/instrument';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const InstrumentsView = () => {
    const classes = usePageStyles();
    const { instrumentId } = useParams<InstrumentCalibrationViewParams>();

    const [_calibrations, setCalibrations] = useState<Kalibrering[]>();
    const [loadedInstrumentId, setLoadedInstrumentId] = useState<number>();
    const [instrument, setInstrument] = useState<Instrument>();

    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
    const [openCertificateId, setOpenCertificateId] = useState<number>();

    const getFilePluginInstance = getFilePlugin({
        fileNameGenerator: (file) => {
            if (instrument !== undefined) {
                return `${instrument.name}-${instrument.serienr}.pdf`;
            }
            return 'sertifikat.pdf';
        }
    });
    const { DownloadButton } = getFilePluginInstance;

    const openCertificate = async (calibrationId: number) => {
        if (objectUrl !== undefined) {
            URL.revokeObjectURL(objectUrl);
        }
        setObjectUrl(undefined);
        setOpenCertificateId(undefined);
        try {
            const response = await getCalibrationCertificate(calibrationId);

            if (response.status === 200 && response.data !== undefined) {
                const blob = new Blob([response.data]);

                setObjectUrl(URL.createObjectURL(blob));
                setOpenCertificateId(calibrationId);
            }
            if (response.status === 404) {
                enqueueSnackbar('Kalibreringssertifikat ikke funnet', {
                    variant: 'warning'
                });
            }
        } catch (error) {
            enqueueSnackbar('Ukjent problem med lasting av sertifikat', {
                variant: 'error'
            });
            console.log(error);
        }
    };

    const {
        state: { instruments }
    } = useInstrument();

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const get = async () => {
            setInstrument(
                instruments?.find((i) => i.id === Number(instrumentId))
            );
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
    }, [enqueueSnackbar, instrumentId, instruments, loadedInstrumentId]);

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Kalibreringer">
                            {_calibrations !== undefined &&
                            instrument !== undefined ? (
                                <TableContainer
                                    columns={calibrationColumns({
                                        openCertificate,
                                        openCertificateId,
                                        instrumentLastCalibration:
                                            instrument?.sisteKalibrert
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="calibrations">
                                    <CalibrationTable
                                        calibrations={_calibrations ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster kalibreringer</div>
                            )}
                        </Card>
                    </Grid>

                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                        {objectUrl !== undefined && (
                            <Grid item xs={12} style={{ height: 1250 }}>
                                <div
                                    className="rpv-core__viewer"
                                    style={{
                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                    }}>
                                    <div
                                        style={{
                                            alignItems: 'right',
                                            backgroundColor: '#eeeeee',
                                            borderBottom:
                                                '1px solid rgba(0, 0, 0, 0.3)',
                                            display: 'flex',
                                            padding: '4px'
                                        }}>
                                        <DownloadButton />
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            overflow: 'hidden'
                                        }}>
                                        <Viewer
                                            fileUrl={objectUrl}
                                            plugins={[getFilePluginInstance]}
                                        />
                                    </div>
                                </div>
                            </Grid>
                        )}
                    </Worker>
                </Grid>
            </Container>
        </>
    );
};

export default InstrumentsView;
