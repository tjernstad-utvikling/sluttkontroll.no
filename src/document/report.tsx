import { ReportKontroll, Skjema } from '../contracts/kontrollApi';

import { Document } from '@react-pdf/renderer';
import { FrontPage } from '../document/modules/frontPage';
import { FrontPageData } from './documentContainer';
import { InfoPage } from '../document/modules/infoPage';
import { SkjemaPage } from './modules/skjemaPage';

interface ReportProps {
    hasFrontPage: boolean;
    frontPageData?: FrontPageData;
    hasInfoPage: boolean;
    infoText: string | undefined;
    kontroll: ReportKontroll | undefined;
    hasSkjemaPage: boolean;
    skjemaer: Skjema[] | undefined;
}
export const Report = ({
    hasFrontPage,
    frontPageData,
    hasInfoPage,
    infoText,
    kontroll,
    hasSkjemaPage,
    skjemaer
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
                skjemaer !== undefined && (
                    <SkjemaPage
                        skjemaer={skjemaer}
                        frontPageData={frontPageData}
                    />
                )}
        </Document>
    );
};
