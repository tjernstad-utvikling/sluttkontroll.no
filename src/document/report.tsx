import { Document } from '@react-pdf/renderer';
import { FrontPage } from '../document/modules/frontPage';
import { FrontPageData } from './documentContainer';
import { InfoPage } from '../document/modules/infoPage';

interface ReportProps {
    hasFrontPage: boolean;
    frontPageData?: FrontPageData;
    hasInfoPage: boolean;
    infoText: string | undefined;
}
export const Report = ({
    hasFrontPage,
    frontPageData,
    hasInfoPage,
    infoText
}: ReportProps) => {
    return (
        <Document>
            {hasFrontPage && frontPageData !== undefined && (
                <FrontPage frontPageData={frontPageData} />
            )}
            {hasInfoPage &&
                frontPageData !== undefined &&
                infoText !== undefined && (
                    <InfoPage
                        infoText={infoText}
                        frontPageData={frontPageData}
                    />
                )}
        </Document>
    );
};
