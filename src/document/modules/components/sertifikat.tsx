import { Image, Text, View } from '@react-pdf/renderer';
import { TableHeader, TableRow } from './table';

import { Sertifikat } from '../../../contracts/certificateApi';
import { format } from 'date-fns';

interface SertifikatBlockProps {
    sertifikater: Sertifikat[];
}
export const SertifikatBlock = ({ sertifikater }: SertifikatBlockProps) => {
    return (
        <>
            <TableHeader title="Sertifikater" />
            {sertifikater.map((s) => (
                <TableRow key={s.id} hasBottomBorder>
                    <View style={{ flexGrow: 1, flexDirection: 'column' }}>
                        <View
                            style={{
                                flexGrow: 1,
                                flexDirection: 'row',
                                backgroundColor: '#e9eef5'
                            }}>
                            <Text style={{ width: 220 }}>{s.type.name}</Text>
                            <Text>{s.number}</Text>
                        </View>
                        <View
                            style={{
                                flexGrow: 1,
                                flexDirection: 'row'
                            }}>
                            <Text style={{ width: 220 }}>Gyldig til</Text>
                            <Text>
                                {format(new Date(s.validTo), 'dd.MM.yyyy')}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: 60,
                            padding: 5
                        }}>
                        {s.type.logoBase64 !== undefined &&
                            s.type.logoBase64.length > 0 && (
                                <Image src={s.type.logoBase64} />
                            )}
                    </View>
                </TableRow>
            ))}
        </>
    );
};
