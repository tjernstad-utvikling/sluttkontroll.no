import { useEffect, useState } from 'react';

import { Image as RPRImage } from '@react-pdf/renderer';
import { getImageFile } from '../api/avvikApi';

interface ImageProps {
    src: string;
    width: number;
    height: number;
    alt: string;
}
export const Image = ({ src, width, height, alt }: ImageProps) => {
    const [objectUrl, setObjectUrl] = useState<string>('');

    useEffect(() => {
        const loadImage = async () => {
            try {
                const response = await getImageFile(src);
                if (response.status === 200) {
                    setObjectUrl(URL.createObjectURL(response.data));
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadImage();
    }, [src]);

    return (
        <img
            src={objectUrl}
            width={width}
            height={height}
            alt={alt}
            onLoad={() => URL.revokeObjectURL(objectUrl)}
        />
    );
};
export const PdfImage = ({ src }: { src: string }) => {
    const [objectUrl, setObjectUrl] = useState<string>('');

    useEffect(() => {
        const loadImage = async () => {
            try {
                const response = await getImageFile(src);
                if (response.status === 200) {
                    setObjectUrl(URL.createObjectURL(response.data));
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadImage();
    }, [src]);

    return <RPRImage src={objectUrl} />;
};
