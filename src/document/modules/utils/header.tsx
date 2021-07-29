import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';

import pdfLogo from '../../../assets/pdf-logo.png';

interface HeaderProps {
    title: string;
    location: string;
    date: string;
}
export const Header = ({ title, location, date }: HeaderProps) => {
    return (
        <View style={styles.headerContainer} fixed>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: 5
                }}>
                <Image
                    style={{ width: 60, paddingVertical: 5 }}
                    src={pdfLogo}
                />
                <View
                    style={{
                        fontSize: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text>Rapport {title}</Text>
                    <Text>hos</Text>
                    <Text>{location}</Text>
                </View>

                <Text style={{ alignSelf: 'center', fontSize: 12 }}>
                    {date}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
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
