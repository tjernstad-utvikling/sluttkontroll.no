import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface TableHeaderProps {
    title: string;
}
export const TableHeader = ({ title }: TableHeaderProps) => {
    return (
        <View style={[styles.tableBorder, { textAlign: 'center' }]}>
            <Text style={styles.tableHeader}>{title}</Text>
        </View>
    );
};
interface TableRowProps {
    children: React.ReactNode;
    tint?: boolean;
    hasBottomBorder?: boolean;
}
export const TableRow = ({
    children,
    tint,
    hasBottomBorder
}: TableRowProps) => {
    return (
        <View
            style={{
                fontSize: 12,
                padding: 2,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: (tint && '#e9eef5') || '',
                borderBottom: (hasBottomBorder && '1px solid #5b8bc9') || ''
            }}>
            {children}
        </View>
    );
};
interface TableCellProps {
    children: string;
    width?: number;
    isTitle?: boolean;
}
export const TableCell = ({ children, width, isTitle }: TableCellProps) => {
    return (
        <View
            style={
                width !== undefined
                    ? {
                          width: width
                      }
                    : {}
            }>
            <Text
                style={
                    isTitle
                        ? {
                              fontWeight: 'bold'
                          }
                        : {}
                }>
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tableBorder: {
        borderTop: '1px solid #5b8bc9',
        borderBottom: '1px solid #5b8bc9',
        paddingVertical: 5
    },
    tableHeader: {
        fontSize: 14
    }
});
