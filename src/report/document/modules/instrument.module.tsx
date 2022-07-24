import { DateText, Text } from '../components/text';
import { StyleSheet, View } from '@react-pdf/renderer';
import { TableCell, TableHeader, TableRow } from '../components/table';

import { ReportInstrument } from '../../../contracts/reportApi';
import { Spacer } from '../components/spacing';

interface InstrumentModuleProps {
    instruments: ReportInstrument[] | undefined;
}
export const InstrumentModule = ({
    instruments
}: InstrumentModuleProps): JSX.Element => {
    if (instruments) {
        return (
            <View>
                <TableHeader title="Instrumenter benyttet i kontrollen" />
                <TableRow hasBottomBorder>
                    <TableCell isTitle width={230}>
                        Instrument
                    </TableCell>
                    <TableCell isTitle width={120}>
                        Serienummer
                    </TableCell>
                    <TableCell isTitle width={100}>
                        Kalibrert dato
                    </TableCell>
                </TableRow>
                {instruments.map((instrument, i) => (
                    <TableRow key={instrument.id} tint={!(i % 2 === 0)}>
                        <TableCell width={230}>{instrument.name}</TableCell>
                        <TableCell width={120}>{instrument.serienr}</TableCell>
                        <TableCell width={100}>
                            <DateText>
                                {instrument.sisteKalibrert.date}
                            </DateText>
                        </TableCell>
                    </TableRow>
                ))}

                <Spacer />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text>Det mangler data for generering av instrument modul</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingBottom: 45,
        paddingHorizontal: 20
    }
});
