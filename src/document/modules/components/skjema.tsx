import { TableCell, TableRow } from './table';

interface ChecklistRowProps {
    nr: string;
    prosedyre: string;
    status: string;
}
export const ChecklistRow = ({ nr, prosedyre, status }: ChecklistRowProps) => {
    return (
        <TableRow>
            <TableCell width={50}>{nr}</TableCell>
            <TableCell width={500}>{prosedyre}</TableCell>
            <TableCell width={80}>{status}</TableCell>
        </TableRow>
    );
};
