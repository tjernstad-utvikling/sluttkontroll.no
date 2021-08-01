import { Checklist, ReportKontroll, Skjema } from '../contracts/kontrollApi';

import { Avvik } from '../contracts/avvikApi';
import { Document } from '@react-pdf/renderer';
import { FrontPage } from '../document/modules/frontPage';
import { FrontPageData } from './documentContainer';
import { InfoPage } from '../document/modules/infoPage';
import { Measurement } from '../contracts/measurementApi';
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
    measurements: Measurement[] | undefined;
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
    measurements
}: ReportProps) => {
    return (
        <Document>
            {hasFrontPage && frontPageData !== undefined && (
                <FrontPage frontPageData={frontPageData} />
            )}
            {hasInfoPage &&
                frontPageData !== undefined &&
                infoText !== undefined &&
                kontroll !== undefined && (
                    <InfoPage
                        infoText={infoText}
                        frontPageData={frontPageData}
                        kontroll={kontroll}
                    />
                )}
            {hasSkjemaPage &&
                frontPageData !== undefined &&
                skjemaer !== undefined &&
                checklists !== undefined &&
                avvik !== undefined &&
                skjemaer.map((s) => (
                    <SkjemaPage
                        key={s.id}
                        skjema={s}
                        checklists={checklists.filter(
                            (ch) => ch.skjema.id === s.id
                        )}
                        avvik={avvik}
                        frontPageData={frontPageData}
                    />
                ))}
            {hasMeasurementPage &&
                frontPageData !== undefined &&
                skjemaer !== undefined &&
                measurements !== undefined &&
                skjemaer.map((s, i) => (
                    <MeasurementPage
                        key={s.id}
                        skjema={s}
                        index={i}
                        measurements={measurements.filter(
                            (m) => m.Skjema.id === s.id
                        )}
                        frontPageData={frontPageData}
                    />
                ))}
        </Document>
    );
};
