import { StyleSheet, Text } from '@react-pdf/renderer';

interface TextProps {
    children?: React.ReactNode
}
export const Paragraph = ({ children }: TextProps) => {
    return <Text style={styles.p}>{children}</Text>;
};
export const BoldText = ({ children }: TextProps) => {
    return <Text style={styles.bold}>{children}</Text>;
};
export const ItalicText = ({ children }: TextProps) => {
    return <Text style={styles.italic}>{children}</Text>;
};
export const ItalicBoldText = ({ children }: TextProps) => {
    return <Text style={[styles.italic,styles.bold]}>{children}</Text>;
};
export const Header1 = ({ children }: TextProps) => {
    return (
        <Text style={{ fontSize: 24, textAlign: 'center' }}>{children}</Text>
    );
};
export const Header2 = ({ children }: TextProps) => {
    return <Text style={{ fontSize: 22 }}>{children}</Text>;
};
export const Header3 = ({ children }: TextProps) => {
    return <Text style={{ fontSize: 18 }}>{children}</Text>;
};
export const Header4 = ({ children }: TextProps) => {
    return <Text style={{ fontSize: 16 }}>{children}</Text>;
};
export const Header5 = ({ children }: TextProps) => {
    return <Text style={{ fontSize: 12 }}>{children}</Text>;
};
export const Header6 = ({ children }: TextProps) => {
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
        fontStyle: 'italic'
    }
});
