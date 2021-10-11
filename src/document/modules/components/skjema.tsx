import { TableCell, TableRow } from './table';

import { Avvik } from '../../../contracts/avvikApi';

interface ChecklistRowProps {
    isEvenIndex?: boolean;
    nr: string;
    prosedyre: string;
    avvik: Avvik[];
}
export const ChecklistRow = ({
    isEvenIndex,
    nr,
    prosedyre,
    avvik
}: ChecklistRowProps) => {
    return (
        <TableRow tint={!isEvenIndex}>
            <TableCell width={50}>{nr}</TableCell>
            <TableCell width={500}>{prosedyre}</TableCell>
            <TableCell width={80}>
                {avvik.filter((a) => a.status !== 'lukket').length === 0
                    ? 'OK'
                    : `Avvik(${
                          avvik.filter((a) => a.status !== 'lukket').length
                      })`}
            </TableCell>
        </TableRow>
    );
};
