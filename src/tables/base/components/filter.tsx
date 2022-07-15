import { Column, Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

interface FilterProps<T extends {}> {
    column: Column<T, unknown>;
    table: Table<T>;
}

export function Filter<T extends {}>({ column, table }: FilterProps<T>) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [firstValue]
    );

    return typeof firstValue === 'number' ? (
        <div>
            <div style={{ display: 'flex' }}>
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={(value) =>
                        column.setFilterValue((old: [number, number]) => [
                            value,
                            old?.[1]
                        ])
                    }
                    label={`Min ${
                        column.getFacetedMinMaxValues()?.[0]
                            ? `(${column.getFacetedMinMaxValues()?.[0]})`
                            : ''
                    }`}
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={(value) =>
                        column.setFilterValue((old: [number, number]) => [
                            old?.[0],
                            value
                        ])
                    }
                    label={`Maks ${
                        column.getFacetedMinMaxValues()?.[1]
                            ? `(${column.getFacetedMinMaxValues()?.[1]})`
                            : ''
                    }`}
                />
            </div>
        </div>
    ) : (
        <>
            <DebouncedInput
                type="text"
                id={column.id}
                value={(columnFilterValue ?? '') as string}
                onChange={(value) => column.setFilterValue(value)}
                label={`Søk... (${column.getFacetedUniqueValues().size})`}
                options={sortedUniqueValues
                    .slice(0, 50)
                    .map((value: any) => value)}
            />
        </>
    );
}

interface FilterRemoveProps<T extends {}> {
    column: Column<T, unknown>;
    table: Table<T>;
}

export function FilterRemove<T extends {}>({
    column,
    table
}: FilterRemoveProps<T>) {
    if (column.getIsFiltered())
        return (
            <Tooltip title={'Fjern filter for kolonne'}>
                <IconButton
                    color="error"
                    onClick={() => column.setFilterValue('')}
                    size="small">
                    <FilterAltOffIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
        );
    return null;
}
// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    options,
    label,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
    options?: string[];
    label: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    if (props.type === 'text') {
        return (
            <Autocomplete
                size="small"
                id={props.id}
                options={options ?? []}
                onChange={(e, value) => {
                    setValue(value ?? '');
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                    <TextField {...params} label={label} />
                )}
            />
        );
    }

    return (
        <TextField
            size="small"
            id={props.id}
            variant="outlined"
            sx={{ width: 300 }}
            label={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
