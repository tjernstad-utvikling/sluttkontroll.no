import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

import { parseMd } from '../utils/parseMd';

interface InfoBoxProps {
    text: string;
}
export const InfoBox = ({ text }: InfoBoxProps) => {
    const [info, setInfo] = useState<
        Array<{
            t: string;
            v: string;
        }>
    >([]);
    useEffect(() => {
        setInfo(parseMd(text));
    }, [text]);

    const block = (block: { t: string; v: string }): JSX.Element => {
        switch (block.t) {
            case 'h1':
                return (
                    <Text
                        style={{ fontSize: 24, textAlign: 'center' }}
                        key={block.v}>
                        {block.v}
                    </Text>
                );
            case 'h2':
                return (
                    <Text style={{ fontSize: 16 }} key={block.v}>
                        {block.v}
                    </Text>
                );
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
            case 'p':
                return (
                    <Text
                        style={{ fontSize: 12, paddingBottom: 10 }}
                        key={block.v}>
                        {block.v}
                    </Text>
                );
            default:
                return <Text></Text>;
        }
    };
    return (
        <View style={styles.tableBorder}>
            {info.map((i) => block(i))}
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
