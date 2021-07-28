import { StyleSheet, Text, View } from '@react-pdf/renderer';

export const Footer = () => {
    return (
        <View style={styles.headerContainer} fixed>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: 5,
                    color: 'grey'
                }}>
                <Text style={{ fontSize: 12 }}>Utskrift: 28.07.2021</Text>
                <Text style={{ fontSize: 12 }}>Sluttkontroll.no</Text>

                <Text
                    style={{ fontSize: 12, color: 'black' }}
                    render={({ pageNumber, totalPages }) =>
                        `${pageNumber} / ${totalPages}`
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        left: 15,
        right: 15,
        bottom: 15
    }
});