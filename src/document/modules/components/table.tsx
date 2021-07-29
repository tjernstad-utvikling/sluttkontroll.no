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
}
export const TableRow = ({ children }: TableRowProps) => {
    return (
        <View
            style={{
                fontSize: 12,
                padding: 2,
                display: 'flex',
                flexDirection: 'row'
            }}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingBottom: 45,
        paddingHorizontal: 20
    },
    tableBorder: {
        borderTop: '1px solid #5b8bc9',
        borderBottom: '1px solid #5b8bc9',
        paddingVertical: 5
    },
    tableHeader: {
        fontSize: 14
    }
});
