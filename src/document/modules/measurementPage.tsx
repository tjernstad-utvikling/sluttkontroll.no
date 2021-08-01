import { Measurement, MeasurementType } from '../../contracts/measurementApi';
import { Page, StyleSheet, Text } from '@react-pdf/renderer';
import { TableCell, TableRow } from './components/table';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { Skjema } from '../../contracts/kontrollApi';
import { Spacer } from './components/spacing';

interface MeasurementPageProps {
    frontPageData: FrontPageData;
    skjema: Skjema;
    measurements: Measurement[];
    index: number;
    measurementTypes: MeasurementType[];
}
export const MeasurementPage = ({
    frontPageData,
    skjema,
    measurements,
    index,
    measurementTypes
}: MeasurementPageProps) => {
    return (
        <Page
            style={[
                { position: 'relative', top: 0, left: 0 },
                styles.container
            ]}>
            <Header
                title={frontPageData.title}
                location={frontPageData.kontrollsted}
                date={frontPageData.date}
            />
            {index === 0 && (
                <Text style={{ paddingVertical: 5 }}>Måleprotokoll</Text>
            )}
            <Text style={{ paddingVertical: 5 }}>
                {skjema.area}, {skjema.omrade}
            </Text>
            <TableRow hasBottomBorder hasTopBorder>
                <TableCell isTitle width={230}>
                    Type / Element
                </TableCell>
                <TableCell isTitle width={90}>
                    Resultat
                </TableCell>
                <TableCell isTitle width={50}>
                    Enhet
                </TableCell>
                <TableCell isTitle width={90}>
                    Maks
                </TableCell>
                <TableCell isTitle>Min</TableCell>
            </TableRow>
            {measurements.map((m, i) => {
                const mt = measurementTypes.find(
                    (mt) => mt.shortName === m.type
                );
                let typeName = m.type;
                if (mt !== undefined) {
                    if (mt.hasPol) {
                        typeName = mt.longName.replace('#', `${m.pol}p`);
                    } else {
                        typeName = mt.longName;
                    }
                }
                return (
                    <TableRow key={m.id} tint={!(i % 2 === 0)}>
                        <TableCell
                            width={
                                230
                            }>{`${typeName} / ${m.element}`}</TableCell>
                        <TableCell width={90}>{m.resultat}</TableCell>
                        <TableCell width={50}>{m.enhet}</TableCell>
                        <TableCell width={90}>{m.maks}</TableCell>
                        <TableCell width={90}>{m.min}</TableCell>
                    </TableRow>
                );
            })}

            <Spacer />

            <Footer />
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingBottom: 45,
        paddingHorizontal: 20
    },
    tableBorder: {
        borderTop: '1px solid #5b8bc9',
        borderBottom: '1px solid #5b8bc9',
        paddingVertical: 5
    },
    tableHeader: {
        fontSize: 14
    }
});
