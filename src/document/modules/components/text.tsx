import { Link, Text as PdfRTExt, StyleSheet } from '@react-pdf/renderer';

import { format } from 'date-fns';

interface TextProps {
    children?: React.ReactNode;
}
export const Paragraph = ({ children }: TextProps) => {
    return <PdfRTExt style={styles.p}>{children}</PdfRTExt>;
};
interface DateTextProps {
    children: string | undefined;
}
export const DateText = ({ children }: DateTextProps) => {
    if (children) {
        return (
            <PdfRTExt style={styles.tekst}>
                {format(new Date(children), 'dd.MM.yyyy')}
            </PdfRTExt>
        );
    }
    return <PdfRTExt style={styles.tekst}>{children}</PdfRTExt>;
};

export const BoldText = ({ children }: TextProps) => {
    return <PdfRTExt style={styles.bold}>{children}</PdfRTExt>;
};
export const Text = ({ children }: TextProps) => {
    return <PdfRTExt style={styles.tekst}>{children}</PdfRTExt>;
};

export const ItalicText = ({ children }: TextProps) => {
    return <PdfRTExt style={styles.italic}>{children}</PdfRTExt>;
};

export const ItalicBoldText = ({ children }: TextProps) => {
    return <PdfRTExt style={[styles.italic, styles.bold]}>{children}</PdfRTExt>;
};

export const Header1 = ({ children }: TextProps) => {
    return (
        <PdfRTExt style={{ fontSize: 24, textAlign: 'center' }}>
            {children}
        </PdfRTExt>
    );
};

export const Header2 = ({ children }: TextProps) => {
    return <PdfRTExt style={{ fontSize: 22 }}>{children}</PdfRTExt>;
};

export const Header3 = ({ children }: TextProps) => {
    return <PdfRTExt style={{ fontSize: 18 }}>{children}</PdfRTExt>;
};

export const Header4 = ({ children }: TextProps) => {
    return <PdfRTExt style={{ fontSize: 16 }}>{children}</PdfRTExt>;
};

export const Header5 = ({ children }: TextProps) => {
    return <PdfRTExt style={{ fontSize: 12 }}>{children}</PdfRTExt>;
};

export const Header6 = ({ children }: TextProps) => {
    return <PdfRTExt style={{ fontSize: 10 }}>{children}</PdfRTExt>;
};

interface LinkTextProps {
    children?: React.ReactNode;
    hrefObj: string;
}
export const LinkText = ({ children, hrefObj }: LinkTextProps) => {
    const url = /href=['"](.+)['"]/i;
    const link = hrefObj.match(url);

    return <Link src={link ? link[1] : ''}>{children}</Link>;
};

const styles = StyleSheet.create({
    p: {
        fontSize: 12,
        paddingBottom: 10,
        fontFamily: 'Roboto'
    },
    tekst: {
        fontFamily: 'Roboto'
    },
    bold: {
        fontWeight: 'bold'
    },
    italic: {
        fontStyle: 'italic'
    }
});
