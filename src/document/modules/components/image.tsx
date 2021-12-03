import { Image as RPRImage, Text, View } from '@react-pdf/renderer';

import { placeholderImage } from '../../../components/image';

export const PdfImage = ({
    src,
    caption
}: {
    src: string | undefined;
    caption: string;
}) => {
    return (
        <View>
            <RPRImage src={src || placeholderImage} />
            <Text>{caption}</Text>
        </View>
    );
};
