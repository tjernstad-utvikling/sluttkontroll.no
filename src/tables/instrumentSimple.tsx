import { ColumnDef, Row } from '@tanstack/react-table';

import { GroupTable } from './base/groupTable';
import { Instrument } from '../contracts/instrumentApi';
import { InstrumentValueGetter } from './instrument';
import { Link } from 'react-router-dom';
import { TableKey } from '../contracts/keys';
import { useMemo } from 'react';

type InstrumentColumns = {
    id: number;
    name: string;
    serienr: string;
    sisteKalibrert: Date | null;
};

interface InstrumentSimpleTableProps {
    instruments: Instrument[];
    isLoading: boolean;
    enableSelection?: boolean;
    onSelected?: (ids: number[]) => void;
    selectedIds?: number[];
}
export const InstrumentSimpleTable = ({
    instruments,
    isLoading,
    onSelected,
    enableSelection,
    selectedIds
}: InstrumentSimpleTableProps) => {
    const data = useMemo((): InstrumentColumns[] => {
        return instruments.map((c) => {
            return {
                ...c,
                sisteKalibrert: c.sisteKalibrert
                    ? new Date(c.sisteKalibrert.date)
                    : null
            };
        });
    }, [instruments]);

    const columns: ColumnDef<InstrumentColumns>[] = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'id',
                enableGrouping: false,
                aggregatedCell: () => ''
            },
            {
                header: 'Instrument',
                accessorKey: 'name',
                enableGrouping: false
            },
            {
                header: 'Serienummer',
                accessorKey: 'serienr',
                enableGrouping: false
            },
            {
                header: 'Siste kalibrering',
                accessorKey: 'sisteKalibrert',
                aggregatedCell: () => '',
                enableGrouping: false,
                cell: ({ cell, row }) => (
                    <>
                        <Link
                            to={`/instrument/${row.getValue(
                                'id'
                            )}/calibration`}>
                            {InstrumentValueGetter(null).sisteKalibrert(
                                'dd.MM.Y',
                                cell.getValue()
                            )}
                        </Link>
                    </>
                )
            }
        ],
        []
    );

    function updateSelected(rows: Row<InstrumentColumns>[]) {
        if (onSelected) onSelected(rows.map((r) => r.getValue('id')));
    }

    return (
        <GroupTable<InstrumentColumns>
            tableKey={TableKey.instrumentSimple}
            columns={columns}
            data={data}
            defaultGrouping={[]}
            defaultVisibilityState={{}}
            isLoading={isLoading}
            selectedIds={selectedIds}
            setSelected={updateSelected}
            preserveSelected
            enableSelection={enableSelection}
        />
    );
};
