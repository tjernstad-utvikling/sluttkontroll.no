import { TableCell, TableRow } from './table';

interface SkjemaRowProps {
    nr: string;
    prosedyre: string;
    status: string;
}
export const SkjemaRow = ({ nr, prosedyre, status }: SkjemaRowProps) => {
    return (
        <TableRow>
            <TableCell width={50}>{nr}</TableCell>
            <TableCell width={500}>{prosedyre}</TableCell>
            <TableCell width={80}>{status}</TableCell>
        </TableRow>
    );
};
