import { StyleSheet, Text, View } from '@react-pdf/renderer';

export const Header = () => {
    return (
        <View style={styles.headerContainer} fixed>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                <Text>Test 1</Text>

                <Text>Test2</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        left: 15,
        right: 15,
        top: 15,
        borderTop: '1px solid #5b8bc9',
        borderBottom: '1px solid #5b8bc9'
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        color: 'grey'
    }
});
