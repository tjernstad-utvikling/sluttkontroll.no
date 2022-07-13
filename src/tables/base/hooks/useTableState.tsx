// credits to https://usehooks.com/useLocalStorage/

import { useEffect, useState } from 'react';

import { TableKey } from '../../../contracts/keys';
import { useDebounce } from '../../../hooks/useDebounce';

export function useTableState<T>(key: TableKey, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // Get from local storage by key
            const item = localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    /**Save table settings to localStorage */
    const debouncedState = useDebounce<T>(storedValue, 500);

    useEffect(() => {
        const val = debouncedState;
        console.log('save to local storage');
        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(val));
    }, [debouncedState, key]);

    return [storedValue, setValue] as const;
}
