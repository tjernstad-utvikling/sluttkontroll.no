import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface InfoBoxProps {
    text: OutputData;
}
export const InfoBox = ({ text }: InfoBoxProps) => {
    function header(block: OutputBlockData<string, any>): JSX.Element {
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
    }

    function paragraph(text: string, id: string | undefined): JSX.Element {
        const boldOrItalic = /(<(?:b|i)>)([^<]+)<\/(?:b|i)>/gim;

        const output: JSX.Element[] = [];
        const textStyling: string[] = [];

        for (const splitText of text.split(boldOrItalic)) {
            if (textStyling[textStyling.length - 1] === 'bold') {
                output.push(
                    <Text
                        key={splitText}
                        style={{
                            fontWeight: 'bold'
                        }}>
                        {splitText}
                    </Text>
                );
            } else if (textStyling[textStyling.length - 1] === 'italic') {
                output.push(
                    <Text
                        key={splitText}
                        style={{
                            fontStyle: 'italic'
                        }}>
                        {splitText}
                    </Text>
                );
            } else {
                if (splitText !== '<b>' && splitText !== '<i>')
                    output.push(<Text key={splitText}>{splitText}</Text>);
            }
            if (splitText === '<b>') textStyling.push('bold');
            else if (splitText === '<i>') textStyling.push('italic');
            else textStyling.push('');
        }

        return (
            <Text
                style={{
                    fontSize: 12,
                    paddingBottom: 10,
                    fontFamily: 'Arial'
                }}
                key={id}>
                {output}
            </Text>
        );
    }

    const block = (block: OutputBlockData<string, any>): JSX.Element => {
        switch (block.type) {
            case 'header':
                return header(block);
            case 'paragraph':
                return paragraph(block.data.text, block.id);
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
