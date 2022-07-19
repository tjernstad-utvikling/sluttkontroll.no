import { StyleSheet, View } from '@react-pdf/renderer';

import { LocalImage } from '../../../contracts/reportApi';
import { OutputData } from '@editorjs/editorjs';
import { Spacer } from '../components/spacing';
import { Text } from '../components/text';
import { TextBox } from '../components/box';

interface StatementPageProps {
    statement: OutputData | undefined;
    statementImages: LocalImage[];
}
export const StatementModule = ({
    statement,
    statementImages
}: StatementPageProps): JSX.Element => {
    if (statement) {
        return (
            <View>
                <TextBox text={statement} statementImages={statementImages} />
                <Spacer />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text>Det mangler data for generering av tekst side</Text>
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
