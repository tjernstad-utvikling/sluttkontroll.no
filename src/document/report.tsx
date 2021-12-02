import { Document, Font } from '@react-pdf/renderer';

import { FrontPage } from './modules/frontPage';
import { InfoPage } from './modules/infoPage';
import { MeasurementPage } from './modules/measurementPage';
import { PDFViewer } from '@react-pdf/renderer';
import { ReportModules } from '../contracts/reportApi';
import { SkjemaPage } from './modules/skjemaPage';
import { StatementPage } from './modules/statementPage';
import arial from '../assets/fonts/arial.ttf';
import arialBold from '../assets/fonts/arialBold.ttf';
import arialBoldItalic from '../assets/fonts/arialBoldItalic.ttf';
import arialItalic from '../assets/fonts/arialItalic.ttf';
import { useReport } from './documentContainer';
import { useWindowSize } from '../hooks/useWindowSize';

Font.register({
    family: 'Arial',
    fonts: [
        {
            src: arial
        },
        {
            src: arialBold,
            fontWeight: 'bold'
        },
        {
            src: arialItalic,
            fontWeight: 'normal',
            fontStyle: 'italic'
        },
        {
            src: arialBoldItalic,
            fontWeight: 'bold',
            fontStyle: 'italic'
        }
    ]
});

export const SlkReport = () => {
    const {
        isModuleActive,
        reportSetting,
        infoText,
        kontroll,
        filteredSkjemaer,
        checklists,
        avvik,
        statementText,
        measurements,
        measurementTypes
    } = useReport();

    const size = useWindowSize();

    return (
        <PDFViewer height={size.height - 120}>
            <Document>
                {isModuleActive(ReportModules.frontPage) && (
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
                        rapportUser={kontroll?.rapportEgenskaper?.rapportUser}
                    />
                )}
                {isModuleActive(ReportModules.statementPage) && (
                    <StatementPage
                        reportSetting={reportSetting}
                        statement={statementText}
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
        </PDFViewer>
    );
};
