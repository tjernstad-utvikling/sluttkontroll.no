import {
    BoldText,
    Header1,
    Header2,
    Header3,
    Header4,
    Header5,
    Header6,
    ItalicText,
    Paragraph,
    ItalicBoldText
} from '../components/text';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface InfoBoxProps {
    text: OutputData;
}
export const InfoBox = ({ text }: InfoBoxProps) => {
    function header(block: OutputBlockData<string, any>): JSX.Element {
        switch (block.data.level) {
            case 1:
                return <Header1 key={block.id}>{block.data.text}</Header1>;
            case 2:
                return <Header2 key={block.id}>{block.data.text}</Header2>;
            case 3:
                return <Header3 key={block.id}>{block.data.text}</Header3>;
            case 4:
                return <Header4 key={block.id}>{block.data.text}</Header4>;
            case 5:
                return <Header5 key={block.id}>{block.data.text}</Header5>;
            case 6:
                return <Header6 key={block.id}>{block.data.text}</Header6>;
            default:
                return <Text></Text>;
        }
    }

    function paragraph(text: string, id: string | undefined): JSX.Element {
        const boldOrItalic = /(<[abi]><[abi]>)?(<[abi]\s*(?:href=["'](.*)["'])?>)?([^<>]+)(?:<\/(?:[abi])>)+(<\/[abi]><\/[abi]>)?/gim;
        const anchor = /<a/i;
        const output: JSX.Element[] = [];
        const textStyling: string[] = [];

        for (const splitText of text.split(boldOrItalic)) {
            if (textStyling[textStyling.length - 1] === 'bold') {
                output.push(<BoldText key={splitText}>{splitText}</BoldText>);
            } else if (textStyling[textStyling.length - 1] === 'italic') {
                output.push(
                    <ItalicText key={splitText}>{splitText}</ItalicText>
                );
            } else if (textStyling[textStyling.length - 1] === 'italicBold') {
                output.push(
                    <ItalicBoldText key={splitText}>{splitText}</ItalicBoldText>
                );
            } else {
                if (splitText !== '<b>' && splitText !== '<i>' && !splitText.match(anchor))
                    output.push(<Text key={splitText}>{splitText}</Text>);
            }
            if (splitText === '<b>') textStyling.push('bold');
            else if (splitText === '<i>') textStyling.push('italic');
            else if (splitText === '<i><b>' || splitText === '<b><i>') textStyling.push('italicBold');
            else if (splitText.match(anchor)) textStyling.push('anchor');
            else textStyling.push('');
        }

        return <Paragraph key={id}>{output}</Paragraph>;
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
