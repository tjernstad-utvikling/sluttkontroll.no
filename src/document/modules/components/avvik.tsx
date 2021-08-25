import { Text, View } from '@react-pdf/renderer';

import { Avvik } from '../../../contracts/avvikApi';
import { PdfImage } from '../../../components/image';
import { format } from 'date-fns';

interface AvvikModuleProps {
    avvik: Avvik;
}
export const AvvikModule = ({ avvik }: AvvikModuleProps) => {
    return (
        <>
            <View wrap={false}>
                <View
                    style={{
                        fontSize: 12,
                        padding: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#5b8bc9'
                    }}>
                    <Text>ID: {avvik.id}</Text>
                    <Text>
                        Oppdaget:{' '}
                        {format(new Date(avvik.registrertDato), 'dd.MM.Y')}
                    </Text>
                </View>
                <View
                    style={{
                        fontSize: 12,
                        padding: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                    <Text style={{ width: 450 }}>{avvik.beskrivelse}</Text>
                    {avvik.avvikBilder.length > 0 && (
                        <PdfImage src={avvik.avvikBilder[0].image} />
                    )}
                </View>
            </View>
            {avvik.avvikBilder.length > 1 &&
                avvik.avvikBilder.slice(1).map((ab) => (
                    <View key={ab.id} style={{ marginLeft: 330 }}>
                        <PdfImage src={ab.image} />
                    </View>
                ))}
        </>
    );
};
