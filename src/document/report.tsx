import { Document, Font } from '@react-pdf/renderer';

import Button from '@mui/material/Button';
import { FrontPage } from './modules/frontPage';
import { FrontPageWImage } from './modules/frontPageWImage';
import { InfoPage } from './modules/infoPage';
import { MeasurementPage } from './modules/measurementPage';
import { PDFViewer } from '@react-pdf/renderer';
import { ReportModules } from '../contracts/reportApi';
import RobotoBold from '../assets/fonts/Roboto-Bold.ttf';
import RobotoBoldItalic from '../assets/fonts/Roboto-BoldItalic.ttf';
import RobotoItalic from '../assets/fonts/Roboto-Italic.ttf';
import RobotoRegular from '../assets/fonts/Roboto-Regular.ttf';
import { SkjemaPage } from './modules/skjemaPage';
import { StatementPage } from './modules/statementPage';
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
    const {
        isModuleActive,
        previewDocument,
        setPreviewDocument,
        statementImages,
        reportSetting,
        infoText,
        kontroll,
        locationImageUrl,
        filteredSkjemaer,
        checklists,
        avvik,
        statementText,
        measurements,
        measurementTypes,
        hasLoaded
    } = useReport();

    const size = useWindowSize();
    if (!hasLoaded) {
        return <div>Laster...</div>;
    }
    if (previewDocument) {
        return (
            <PDFViewer height={size.height} width={size.width - 400}>
                <Document>
                    {isModuleActive(ReportModules.frontPage) &&
                    kontroll?.location.locationImage ? (
                        <FrontPageWImage
                            reportSetting={reportSetting}
                            kontroll={kontroll}
                            locationImageUrl={locationImageUrl}
                        />
                    ) : (
                        <FrontPage
                            reportSetting={reportSetting}
                            kontroll={kontroll}
                        />
                    )}
                    {isModuleActive(ReportModules.infoPage) && (
                        <InfoPage
                            infoText={infoText}
                            reportSetting={reportSetting}
                            rapportEgenskaper={kontroll?.rapportEgenskaper}
                            rapportUser={
                                kontroll?.rapportEgenskaper?.rapportUser
                            }
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
                                checklists={checklists?.filter(
                                    (ch) => ch.skjema.id === s.id
                                )}
                                avvik={avvik}
                                reportSetting={reportSetting}
                                hasInlineMeasurements={
                                    isModuleActive(
                                        ReportModules.measurementPage
                                    ) &&
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
                        !isModuleActive(
                            ReportModules.inlineMeasurementModule
                        ) &&
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
            </PDFViewer>
        );
    }
    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setPreviewDocument(true)}>
                Forhåndsvis rapport
            </Button>
        </div>
    );
};
