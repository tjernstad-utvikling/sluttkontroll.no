import { Document, Font } from '@react-pdf/renderer';
import { ReportModules, useReport } from './documentContainer';

import { FrontPage } from './modules/frontPage';
import { InfoPage } from './modules/infoPage';
import { MeasurementPage } from './modules/measurementPage';
import { PDFViewer } from '@react-pdf/renderer';
import { SkjemaPage } from './modules/skjemaPage';
import { StatementPage } from './modules/statementPage';
import arial from '../assets/fonts/arial.ttf';
import arialBold from '../assets/fonts/arialBold.ttf';
import arialBoldItalic from '../assets/fonts/arialBoldItalic.ttf';
import arialItalic from '../assets/fonts/arialItalic.ttf';
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
        visibleReportModules,
        frontPageData,
        infoText,
        kontroll,
        filteredSkjemaer,
        checklists,
        avvik,
        statementText,
        images,
        measurements,
        measurementTypes
    } = useReport();

    const size = useWindowSize();

    return (
        <PDFViewer height={size.height - 120}>
            <Document>
                {visibleReportModules.includes(ReportModules.frontPage) &&
                    frontPageData !== undefined && (
                        <FrontPage frontPageData={frontPageData} />
                    )}
                {visibleReportModules.includes(ReportModules.infoPage) &&
                    frontPageData !== undefined &&
                    infoText !== undefined &&
                    kontroll !== undefined &&
                    kontroll.rapportEgenskaper !== null &&
                    kontroll.rapportEgenskaper.rapportUser !== null && (
                        <InfoPage
                            infoText={infoText}
                            frontPageData={frontPageData}
                            rapportEgenskaper={kontroll.rapportEgenskaper}
                            rapportUser={kontroll.rapportEgenskaper.rapportUser}
                        />
                    )}
                {visibleReportModules.includes(ReportModules.statementPage) &&
                    frontPageData !== undefined &&
                    statementText !== undefined &&
                    kontroll !== undefined && (
                        <StatementPage
                            frontPageData={frontPageData}
                            statement={statementText}
                            images={images}
                        />
                    )}
                {visibleReportModules.includes(ReportModules.skjemaPage) &&
                    visibleReportModules.includes(
                        ReportModules.controlModule
                    ) &&
                    frontPageData !== undefined &&
                    filteredSkjemaer !== undefined &&
                    checklists !== undefined &&
                    avvik !== undefined &&
                    measurements !== undefined &&
                    measurementTypes !== undefined &&
                    filteredSkjemaer.map((s) => (
                        <SkjemaPage
                            key={s.id}
                            skjema={s}
                            checklists={checklists.filter(
                                (ch) => ch.skjema.id === s.id
                            )}
                            avvik={avvik}
                            frontPageData={frontPageData}
                            hasInlineMeasurements={
                                visibleReportModules.includes(
                                    ReportModules.measurementPage
                                ) &&
                                visibleReportModules.includes(
                                    ReportModules.inlineMeasurementModule
                                )
                            }
                            measurements={measurements.filter(
                                (m) => m.skjema.id === s.id
                            )}
                            measurementTypes={measurementTypes}
                        />
                    ))}
                {visibleReportModules.includes(ReportModules.measurementPage) &&
                    visibleReportModules.includes(
                        ReportModules.controlModule
                    ) &&
                    !visibleReportModules.includes(
                        ReportModules.inlineMeasurementModule
                    ) &&
                    frontPageData !== undefined &&
                    filteredSkjemaer !== undefined &&
                    measurements !== undefined &&
                    measurementTypes !== undefined &&
                    filteredSkjemaer.map((s, i) => (
                        <MeasurementPage
                            key={s.id}
                            skjema={s}
                            index={i}
                            measurements={measurements.filter(
                                (m) => m.skjema.id === s.id
                            )}
                            frontPageData={frontPageData}
                            measurementTypes={measurementTypes}
                        />
                    ))}
            </Document>
        </PDFViewer>
    );
};
