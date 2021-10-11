import { Checklist, ReportKontroll, Skjema } from '../contracts/kontrollApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';

import { Avvik } from '../contracts/avvikApi';
import { Document } from '@react-pdf/renderer';
import { FrontPage } from '../document/modules/frontPage';
import { FrontPageData } from './documentContainer';
import { InfoPage } from '../document/modules/infoPage';
import { MeasurementPage } from './modules/measurementPage';
import { SkjemaPage } from './modules/skjemaPage';

interface ReportProps {
    hasFrontPage: boolean;
    frontPageData?: FrontPageData;
    hasInfoPage: boolean;
    infoText: string | undefined;
    kontroll: ReportKontroll | undefined;
    hasSkjemaPage: boolean;
    skjemaer: Skjema[] | undefined;
    checklists: Checklist[] | undefined;
    avvik: Avvik[] | undefined;
    hasMeasurementPage: boolean;
    hasInlineMeasurements: boolean;
    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;
}
export const Report = ({
    hasFrontPage,
    frontPageData,
    hasInfoPage,
    infoText,
    kontroll,
    hasSkjemaPage,
    skjemaer,
    checklists,
    avvik,
    hasMeasurementPage,
    hasInlineMeasurements,
    measurements,
    measurementTypes
}: ReportProps) => {
    return (
        <Document>
            {hasFrontPage && frontPageData !== undefined && (
                <FrontPage frontPageData={frontPageData} />
            )}
            {hasInfoPage &&
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
            {hasSkjemaPage &&
                frontPageData !== undefined &&
                skjemaer !== undefined &&
                checklists !== undefined &&
                avvik !== undefined &&
                measurements !== undefined &&
                measurementTypes !== undefined &&
                skjemaer.map((s) => (
                    <SkjemaPage
                        key={s.id}
                        skjema={s}
                        checklists={checklists.filter(
                            (ch) => ch.skjema.id === s.id
                        )}
                        avvik={avvik}
                        frontPageData={frontPageData}
                        hasInlineMeasurements={hasInlineMeasurements}
                        measurements={measurements.filter(
                            (m) => m.skjema.id === s.id
                        )}
                        measurementTypes={measurementTypes}
                    />
                ))}
            {hasMeasurementPage &&
                frontPageData !== undefined &&
                skjemaer !== undefined &&
                measurements !== undefined &&
                measurementTypes !== undefined &&
                skjemaer.map((s, i) => (
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
    );
};
