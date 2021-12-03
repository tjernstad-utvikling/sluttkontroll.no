import {
    BoldText,
    Header1,
    Header2,
    Header3,
    Header4,
    Header5,
    Header6,
    ItalicBoldText,
    ItalicText,
    LinkText,
    Paragraph
} from '../components/text';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { ImageBlockData } from '../../../tools/editor';
import { PdfImage } from './image';

interface TextBoxProps {
    text: OutputData;
}
export const TextBox = ({ text }: TextBoxProps) => {
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
                return <Text key={block.id}></Text>;
        }
    }

    function paragraph(text: string, id: string | undefined): JSX.Element {
        const boldOrItalic =
            /(<[abi]><[abi]>)?(<[abi]\s*[a-zæøå:/\\ .="']*>)?([^<>]+)(?:<\/(?:[abi])>)+(?:<\/[abi]><\/[abi]>)?/gim;
        const anchor = /<a/i;
        const output: JSX.Element[] = [];
        const textStyling: string[] = [];
        let linkUrl = '';

        for (const splitText of text
            .replace(/<br>/gi, '\n')
            .split(boldOrItalic)) {
            /**
             * Skip if splitText is undefined
             */
            if (splitText === undefined) continue;

            /**
             * Switch for returning jsx element
             */
            switch (textStyling[textStyling.length - 1]) {
                case 'bold':
                    output.push(
                        <BoldText key={splitText}>{splitText}</BoldText>
                    );
                    break;
                case 'italic':
                    output.push(
                        <ItalicText key={splitText}>{splitText}</ItalicText>
                    );
                    break;
                case 'italicBold':
                    output.push(
                        <ItalicBoldText key={splitText}>
                            {splitText}
                        </ItalicBoldText>
                    );
                    break;
                case 'anchor':
                    output.push(
                        <LinkText hrefObj={linkUrl} key={splitText}>
                            {splitText}
                        </LinkText>
                    );
                    break;
                default:
                    if (
                        splitText !== '<b>' &&
                        splitText !== '<i>' &&
                        splitText !== '<i><b>' &&
                        splitText !== '<b><i>' &&
                        !splitText?.match(anchor)
                    ) {
                        output.push(<Text key={splitText}>{splitText}</Text>);
                    }
                    break;
            }

            /**
             * drop switch if it is an link, cannot check witch match in switch
             */
            if (splitText?.match(anchor)) {
                textStyling.push('anchor');
                linkUrl = splitText;
            } else {
                /**
                 * switch for setting up styling for next splitText
                 */
                switch (splitText) {
                    case '<b>':
                        textStyling.push('bold');
                        break;
                    case '<i>':
                        textStyling.push('italic');
                        break;
                    case '<i><b>':
                    case '<b><i>':
                        textStyling.push('italicBold');
                        break;

                    default:
                        textStyling.push('');
                        break;
                }
            }
        }

        return <Paragraph key={id}>{output}</Paragraph>;
    }

    function imageBlock(data: ImageBlockData, id: string | undefined) {
        return (
            <PdfImage
                key={id}
                src={data.file.localUrl}
                caption={data.caption}
            />
        );
    }

    const block = (block: OutputBlockData<string, any>): JSX.Element => {
        switch (block.type) {
            case 'header':
                return header(block);
            case 'paragraph':
                return paragraph(block.data.text, block.id);
            case 'image':
                return imageBlock(block.data, block.id);
            default:
                return <Text key={block.id}></Text>;
        }
    };
    return (
        <View style={styles.tableBorder}>
            {text.blocks.map((b) => block(b))}
        </View>
    );
};

const styles = StyleSheet.create({
    tableBorder: {
        border: '1.5px double #5b8bc9',
        padding: 5
    }
});
