import {
    Measurement,
    MeasurementType
} from '../../../contracts/measurementApi';
import { TableCell, TableRow } from './table';

interface MeasurementPageProps {
    measurements: Measurement[];
    measurementTypes: MeasurementType[];
}
export const MeasurementModule = ({
    measurements,
    measurementTypes
}: MeasurementPageProps) => {
    return (
        <>
            <TableRow hasBottomBorder hasTopBorder>
                <TableCell isTitle width={230}>
                    Type / Element
                </TableCell>
                <TableCell isTitle width={90}>
                    Resultat
                </TableCell>
                <TableCell isTitle width={50}>
                    Enhet
                </TableCell>
                <TableCell isTitle width={90}>
                    Maks
                </TableCell>
                <TableCell isTitle>Min</TableCell>
            </TableRow>
            {measurements.map((m, i) => {
                const mt = measurementTypes.find(
                    (mt) => mt.shortName === m.type
                );
                let typeName = m.type;
                if (mt !== undefined) {
                    if (mt.hasPol) {
                        typeName = mt.longName.replace('#', `${m.pol}p`);
                    } else {
                        typeName = mt.longName;
                    }
                }
                return (
                    <TableRow key={m.id} tint={!(i % 2 === 0)}>
                        <TableCell
                            width={
                                230
                            }>{`${typeName} / ${m.element}`}</TableCell>
                        <TableCell width={90}>{m.resultat}</TableCell>
                        <TableCell width={50}>{m.enhet}</TableCell>
                        <TableCell width={90}>{m.maks}</TableCell>
                        <TableCell width={90}>{m.min}</TableCell>
                    </TableRow>
                );
            })}
        </>
    );
};
