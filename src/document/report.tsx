import { Document, Page, StyleSheet, Text } from '@react-pdf/renderer';

import { FrontPage } from '../document/modules/frontPage';
import { FrontPageData } from './documentContainer';
import { InfoPage } from '../document/modules/infoPage';

interface ReportProps {
    hasFrontPage: boolean;
    frontPageData?: FrontPageData;
    hasInfoPage: boolean;
}
export const Report = ({
    hasFrontPage,
    frontPageData,
    hasInfoPage
}: ReportProps) => {
    return (
        <Document>
            {hasFrontPage && frontPageData !== undefined && (
                <FrontPage frontPageData={frontPageData} />
            )}
            {hasInfoPage && frontPageData !== undefined && (
                <InfoPage frontPageData={frontPageData} />
            )}
            <Page>
                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) =>
                        `${pageNumber} / ${totalPages}`
                    }
                    fixed
                />
            </Page>
        </Document>
    );
};

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35
    },
    title: {
        fontSize: 24,
        textAlign: 'center'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40
    },
    subtitle: {
        fontSize: 18,
        margin: 12
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey'
    }
});
