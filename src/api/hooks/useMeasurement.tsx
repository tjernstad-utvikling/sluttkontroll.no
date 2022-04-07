import { useQuery, useQueryClient } from 'react-query';

import { Measurement } from '../../contracts/measurementApi';
import sluttkontrollApi from '../sluttkontroll';

export function useMeasurements({
    clientId,
    locationId,
    skjemaId,
    kontrollId,
    myControl
}: {
    clientId?: number;
    locationId?: number;
    skjemaId?: number;
    kontrollId?: number;
    myControl?: boolean;
}) {
    return useQuery(
        [
            'measurements',
            ...(locationId
                ? ['location', locationId]
                : clientId
                ? ['client', clientId]
                : skjemaId
                ? ['skjema', skjemaId]
                : kontrollId
                ? ['kontroll', kontrollId]
                : myControl
                ? ['myControl', myControl]
                : [])
        ],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                measurements: Measurement[];
            }>(`/measurement`, {
                params: {
                    ...(locationId
                        ? { locationId }
                        : clientId
                        ? { clientId }
                        : skjemaId
                        ? { skjemaId }
                        : kontrollId
                        ? { kontrollId }
                        : myControl
                        ? { myControl }
                        : {})
                }
            });
            return data.measurements;
        },
        {
            // The query will not execute until the kontrollId exists
            enabled:
                !!skjemaId ||
                !!locationId ||
                !!clientId ||
                !!kontrollId ||
                !!myControl
        }
    );
}

export function useMeasurementById(measurementId: number | undefined) {
    const queryClient = useQueryClient();
    return useQuery(
        ['measurement', measurementId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                measurement: Measurement;
            }>(`/measurement/${measurementId}`);
            return data.measurement;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Measurement[]>('measurement')
                    ?.find((m) => m.id === measurementId);
            },

            // The query will not execute until the avvikId exists
            enabled: !!measurementId
        }
    );
}
