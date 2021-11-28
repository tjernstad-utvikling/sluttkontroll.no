import { StyleSheet, Text } from '@react-pdf/renderer';

export const Paragraph = (children?: React.ReactNode) => {
    return <Text style={styles.p}>{children}</Text>;
};
export const BoldText = (children?: React.ReactNode) => {
    return <Text style={styles.bold}>{children}</Text>;
};
export const ItalicText = (children?: React.ReactNode) => {
    return <Text style={styles.italic}>{children}</Text>;
};
export const Header1 = (children?: React.ReactNode) => {
    return (
        <Text style={{ fontSize: 24, textAlign: 'center' }}>{children}</Text>
    );
};
export const Header2 = (children?: React.ReactNode) => {
    return <Text style={{ fontSize: 22 }}>{children}</Text>;
};
export const Header3 = (children?: React.ReactNode) => {
    return <Text style={{ fontSize: 18 }}>{children}</Text>;
};
export const Header4 = (children?: React.ReactNode) => {
    return <Text style={{ fontSize: 16 }}>{children}</Text>;
};
export const Header5 = (children?: React.ReactNode) => {
    return <Text style={{ fontSize: 12 }}>{children}</Text>;
};
export const Header6 = (children?: React.ReactNode) => {
    return <Text style={{ fontSize: 10 }}>{children}</Text>;
};

const styles = StyleSheet.create({
    p: {
        fontSize: 12,
        paddingBottom: 10,
        fontFamily: 'Arial'
    },
    bold: {
        fontWeight: 'bold'
    },
    italic: {
        fontWeight: 'bold'
    }
});
