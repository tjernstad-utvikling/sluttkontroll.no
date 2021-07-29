import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface InfoBoxProps {}
export const InfoBox = () => {
    return (
        <View style={styles.tableBorder}>
            <Text>knfvlkdsnfvaødfnø</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tableBorder: {
        border: '1.5px double #5b8bc9',
        padding: 5
    }
});
