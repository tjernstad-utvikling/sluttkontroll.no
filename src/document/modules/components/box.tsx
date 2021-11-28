import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface InfoBoxProps {
    text: OutputData;
}
export const InfoBox = ({ text }: InfoBoxProps) => {
    const header = (block: OutputBlockData<string, any>): JSX.Element => {
        switch (block.data.level) {
            case 1:
                return (
                    <Text
                        style={{ fontSize: 24, textAlign: 'center' }}
                        key={block.id}>
                        {block.data.text}
                    </Text>
                );
            case 2:
                return (
                    <Text style={{ fontSize: 16 }} key={block.id}>
                        {block.data.text}
                    </Text>
                );
            default:
                return <Text></Text>;
        }
    };
    const block = (block: OutputBlockData<string, any>): JSX.Element => {
        switch (block.type) {
            case 'header':
                return header(block);
            case 'paragraph':
                return (
                    <Text
                        style={{ fontSize: 12, paddingBottom: 10 }}
                        key={block.id}>
                        {block.data.text}
                    </Text>
                );
            default:
                return <Text></Text>;
        }
    };
    return (
        <View style={styles.tableBorder}>
            {text.blocks.map((b) => block(b))}
            <Text></Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tableBorder: {
        border: '1.5px double #5b8bc9',
        padding: 5
    }
});
