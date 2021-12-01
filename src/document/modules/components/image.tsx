import { Image as RPRImage, Text, View } from '@react-pdf/renderer';

export const PdfImage = ({
    src,
    caption
}: {
    src: string;
    caption: string;
}) => {
    return (
        <View>
            <RPRImage src={src} />
            <Text>{caption}</Text>
        </View>
    );
};
