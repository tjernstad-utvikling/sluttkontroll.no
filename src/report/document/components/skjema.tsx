import { TableCell, TableRow } from './table';

import { Avvik } from '../../../contracts/avvikApi';

interface ChecklistRowProps {
    isEvenIndex?: boolean;
    nr: string;
    prosedyre: string;
    avvik: Avvik[];
    notApplicable: boolean;
}
export const ChecklistRow = ({
    isEvenIndex,
    nr,
    prosedyre,
    avvik,
    notApplicable
}: ChecklistRowProps) => {
    return (
        <TableRow tint={!isEvenIndex}>
            <TableCell width={50}>{nr}</TableCell>
            <TableCell width={500}>{prosedyre}</TableCell>
            <TableCell width={80}>
                {notApplicable
                    ? 'Ikke aktuell'
                    : avvik.filter((a) => a.status !== 'lukket').length === 0
                    ? 'OK'
                    : `Avvik(${
                          avvik.filter((a) => a.status !== 'lukket').length
                      })`}
            </TableCell>
        </TableRow>
    );
};
interface ChecklistSectionProps {
    title: string;
}
export const ChecklistSection = ({ title }: ChecklistSectionProps) => {
    return (
        <TableRow style={{ backgroundColor: '#9BC1E5' }}>
            <TableCell>{title}</TableCell>
        </TableRow>
    );
};
