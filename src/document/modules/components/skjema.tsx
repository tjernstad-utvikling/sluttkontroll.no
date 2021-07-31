import { TableCell, TableRow } from './table';

interface ChecklistRowProps {
    isEvenIndex?: boolean;
    nr: string;
    prosedyre: string;
    status: string;
}
export const ChecklistRow = ({
    isEvenIndex,
    nr,
    prosedyre,
    status
}: ChecklistRowProps) => {
    return (
        <TableRow tint={!isEvenIndex}>
            <TableCell width={50}>{nr}</TableCell>
            <TableCell width={500}>{prosedyre}</TableCell>
            <TableCell width={80}>{status}</TableCell>
        </TableRow>
    );
};
