import { Document, Font, usePDF } from '@react-pdf/renderer';
import { ExtendedSkjema, ReportKontroll } from '../contracts/kontrollApi';
import {
    LocalImage,
    ReportModules,
    ReportSetting
} from '../contracts/reportApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';
import { useEffect, useState } from 'react';

import { Attachment } from '../contracts/attachmentApi';
import { Avvik } from '../contracts/avvikApi';
import Button from '@mui/material/Button';
import { FrontPage } from './modules/frontPage';
import { InfoPage } from './modules/infoPage';
import { MeasurementPage } from './modules/measurementPage';
import { OutputData } from '@editorjs/editorjs';
import PDFMerger from 'pdf-merger-js/browser';
import { PDFViewer } from '@react-pdf/renderer';
import RobotoBold from '../assets/fonts/Roboto-Bold.ttf';
import RobotoBoldItalic from '../assets/fonts/Roboto-BoldItalic.ttf';
import RobotoItalic from '../assets/fonts/Roboto-Italic.ttf';
import RobotoRegular from '../assets/fonts/Roboto-Regular.ttf';
import { SkjemaPage } from './modules/skjemaPage';
import { StatementPage } from './modules/statementPage';
import { Theme } from '@mui/material';
import { getAttachmentFile } from '../api/attachmentApi';
import { makeStyles } from '../theme/makeStyles';
import { useReport } from './documentContainer';
import { useWindowSize } from '../hooks/useWindowSize';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: RobotoRegular
        },
        {
            src: RobotoBold,
            fontWeight: 'bold'
        },
        {
            src: RobotoItalic,
            fontWeight: 'normal',
            fontStyle: 'italic'
        },
        {
            src: RobotoBoldItalic,
            fontWeight: 'bold',
            fontStyle: 'italic'
        }
    ]
});

export const SlkReport = () => {
    const { classes } = useStyles();
    const {
        isModuleActive,
        previewDocument,
        setPreviewDocument,
        statementImages,
        reportSetting,
        infoText,
        kontroll,
        filteredSkjemaer,
        avvik,
        statementText,
        measurements,
        measurementTypes,
        hasLoaded,
        selectedAttachments,
        downloadReport,
        setDownloadReport
    } = useReport();

    const size = useWindowSize();
    if (!hasLoaded) {
        return <div>Laster...</div>;
    }
    if (previewDocument) {
        return (
            <>
                <Button
                    className={classes.button}
                    style={{ marginLeft: 0 }}
                    variant="contained"
                    color="error"
                    onClick={() => setPreviewDocument(false)}>
                    Lukk forhåndsvisning
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setPreviewDocument(false);
                        setDownloadReport(true);
                    }}>
                    Last ned rapport
                </Button>
                <PDFViewer height={size.height} width={size.width - 400}>
                    <SlkDocument
                        isModuleActive={isModuleActive}
                        statementImages={statementImages}
                        reportSetting={reportSetting}
                        infoText={infoText}
                        kontroll={kontroll}
                        filteredSkjemaer={filteredSkjemaer}
                        avvik={avvik}
                        statementText={statementText}
                        measurements={measurements}
                        measurementTypes={measurementTypes}
                    />
                </PDFViewer>
            </>
        );
    }
    if (downloadReport) {
        return (
            <AttachmentMerger attachments={selectedAttachments}>
                <SlkDocument
                    isModuleActive={isModuleActive}
                    statementImages={statementImages}
                    reportSetting={reportSetting}
                    infoText={infoText}
                    kontroll={kontroll}
                    filteredSkjemaer={filteredSkjemaer}
                    avvik={avvik}
                    statementText={statementText}
                    measurements={measurements}
                    measurementTypes={measurementTypes}
                />
            </AttachmentMerger>
        );
    }
    return (
        <>
            <Button
                className={classes.button}
                style={{ marginLeft: 0 }}
                variant="contained"
                color="info"
                onClick={() => setPreviewDocument(true)}>
                Forhåndsvis rapport
            </Button>
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => setDownloadReport(true)}>
                Last ned rapport
            </Button>
        </>
    );
};

interface AttachmentProps {
    children: JSX.Element;
    attachments: Attachment[];
}
const AttachmentMerger = ({ children, attachments }: AttachmentProps) => {
    const { classes } = useStyles();
    const [instance] = usePDF({ document: children });
    const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
    const [startedLoading, setStartedLoading] = useState<boolean>(false);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string>();
    const { setDownloadReport } = useReport();

    useEffect(() => {
        const render = async () => {
            const merger = new PDFMerger();

            if (instance.blob) await merger.add(instance.blob);

            for (const attachment of attachments) {
                const res = await getAttachmentFile(attachment.file);

                await merger.add(res.data);
            }

            const mergedPdf = await merger.saveAsBlob();
            const url = URL.createObjectURL(mergedPdf);
            setMergedPdfUrl(url);
            const fileLink = document.createElement('a');
            fileLink.href = url;
            fileLink.setAttribute('download', 'Kontrollrapport.pdf');
            document.body.appendChild(fileLink);
            fileLink.click();

            return;
        };
        if (instance.loading) setStartedLoading(true);

        if (startedLoading && !instance.loading) setFinishedLoading(true);

        if (startedLoading && finishedLoading) {
            render().catch((err) => {
                throw err;
            });
        }
    }, [attachments, finishedLoading, instance, startedLoading]);

    if (instance.loading) return <div>Laster ...</div>;

    if (instance.error)
        return <div>Something went wrong: {instance.error}</div>;

    if (mergedPdfUrl)
        return (
            <>
                <Button
                    className={classes.button}
                    style={{ marginLeft: 0 }}
                    variant="contained"
                    color="error"
                    onClick={() => setDownloadReport(false)}>
                    Avbryt
                </Button>
                <a
                    className={classes.button}
                    href={mergedPdfUrl}
                    download="Kontrollrapport.pdf">
                    Trykk her om filen ikke blir lastet ned
                </a>
            </>
        );
    return <div>Genererer ferdig rapport ...</div>;
};

interface SlkDocumentProps {
    statementImages: LocalImage[];
    infoText: OutputData | undefined;
    statementText: OutputData | undefined;
    reportSetting: ReportSetting | undefined;
    isModuleActive: (reportModule: ReportModules) => boolean;
    kontroll: ReportKontroll | undefined;
    filteredSkjemaer: ExtendedSkjema[] | undefined;
    avvik: Avvik[] | undefined;
    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;
}
const SlkDocument = ({
    isModuleActive,
    statementImages,
    reportSetting,
    infoText,
    kontroll,
    filteredSkjemaer,
    avvik,
    statementText,
    measurements,
    measurementTypes
}: SlkDocumentProps) => {
    return (
        <Document>
            {isModuleActive(ReportModules.frontPage) && (
                <FrontPage reportSetting={reportSetting} kontroll={kontroll} />
            )}
            {isModuleActive(ReportModules.infoPage) && (
                <InfoPage
                    infoText={infoText}
                    reportSetting={reportSetting}
                    rapportEgenskaper={kontroll?.rapportEgenskaper}
                    rapportUser={kontroll?.rapportEgenskaper?.rapportUser}
                />
            )}
            {isModuleActive(ReportModules.statementPage) && (
                <StatementPage
                    reportSetting={reportSetting}
                    statement={statementText}
                    statementImages={statementImages}
                />
            )}
            {isModuleActive(ReportModules.skjemaPage) &&
                isModuleActive(ReportModules.controlModule) &&
                filteredSkjemaer?.map((s) => (
                    <SkjemaPage
                        key={s.id}
                        skjema={s}
                        avvik={avvik}
                        reportSetting={reportSetting}
                        hasInlineMeasurements={
                            isModuleActive(ReportModules.measurementPage) &&
                            isModuleActive(
                                ReportModules.inlineMeasurementModule
                            )
                        }
                        measurements={measurements?.filter(
                            (m) => m.skjema.id === s.id
                        )}
                        measurementTypes={measurementTypes}
                    />
                ))}
            {isModuleActive(ReportModules.measurementPage) &&
                isModuleActive(ReportModules.controlModule) &&
                !isModuleActive(ReportModules.inlineMeasurementModule) &&
                filteredSkjemaer?.map((s, i) => (
                    <MeasurementPage
                        key={s.id}
                        skjema={s}
                        index={i}
                        measurements={measurements?.filter(
                            (m) => m.skjema.id === s.id
                        )}
                        reportSetting={reportSetting}
                        measurementTypes={measurementTypes}
                    />
                ))}
        </Document>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    button: {
        margin: theme.spacing(1)
    }
}));
