import { StyleSheet, View } from '@react-pdf/renderer';

import { Text } from './text';

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
    hasTopBorder?: boolean;
    hasBottomBorder?: boolean;
    style?: { backgroundColor?: string | undefined };
}
export const TableRow = ({
    children,
    tint,
    hasBottomBorder,
    hasTopBorder,
    style
}: TableRowProps) => {
    return (
        <View
            style={[
                {
                    fontSize: 12,
                    padding: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: (tint && '#e9eef5') || '',
                    borderBottom:
                        (hasBottomBorder && '1px solid #5b8bc9') || '',
                    borderTop: (hasTopBorder && '1px solid #5b8bc9') || ''
                },
                style ? style : {}
            ]}>
            {children}
        </View>
    );
};
interface TableCellProps {
    children?: React.ReactNode;
    width?: number;
    isTitle?: boolean;
}
export const TableCell = ({ children, width, isTitle }: TableCellProps) => {
    return (
        <View
            style={[
                width !== undefined
                    ? {
                          width: width
                      }
                    : { flexGrow: 1 }
            ]}>
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
