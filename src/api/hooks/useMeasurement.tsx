import {
    Measurement,
    MeasurementType,
    NewFormMeasurement
} from '../../contracts/measurementApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

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

export function useAddMeasurement() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Measurement,
        unknown,
        {
            measurement: NewFormMeasurement;
            skjemaId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                measurement: Measurement;
            }>(`/measurement/${body.skjemaId}`, { ...body.measurement });
            return data.measurement;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newMeasurement, vars) => {
                const measurements = queryClient.getQueryData<Measurement[]>([
                    'measurements',
                    'skjema',
                    vars.skjemaId
                ]);
                // ✅ update detail view directly

                if (measurements && measurements.length > 0) {
                    queryClient.setQueryData(
                        ['measurements'],
                        unionBy([newMeasurement], measurements, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }

                enqueueSnackbar('Måling lagret', {
                    variant: 'success'
                });

                queryClient.invalidateQueries(['measurements']);
            },
            onError: (error: any) => {
                enqueueSnackbar('Ukjent feil ved opplastning', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useUpdateMeasurement() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            measurement: Measurement;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(`/measurement/`, {
                ...body.measurement
            });
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const measurements = queryClient.getQueryData<Measurement[]>([
                    'measurements',
                    'skjema',
                    vars.measurement.skjema.id
                ]);
                // ✅ update detail view directly

                if (measurements && measurements.length > 0) {
                    queryClient.setQueryData(
                        ['measurements'],
                        unionBy([vars.measurement], measurements, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }

                enqueueSnackbar('Måling lagret', {
                    variant: 'success'
                });

                queryClient.invalidateQueries(['measurements']);
            },
            onError: (error: any) => {
                enqueueSnackbar('Ukjent feil ved opplastning', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useMoveMeasurement() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            measurement: Measurement;
            skjemaId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `measurement/move/${body.measurement.id}/to/${body.skjemaId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updated, vars) => {
                const measurements = queryClient.getQueryData<Measurement[]>([
                    'measurements',
                    'skjema',
                    vars.skjemaId
                ]);
                // ✅ update detail view directly

                if (measurements && measurements?.length > 0) {
                    queryClient.setQueryData(
                        ['measurements'],
                        unionBy(
                            [
                                {
                                    ...vars.measurement,
                                    skjema: {
                                        ...vars.measurement.skjema,
                                        id: vars.skjemaId
                                    }
                                }
                            ],
                            measurements,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries(['measurements']);

                enqueueSnackbar('Måling flyttet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Kan ikke flytte målingen', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useMeasurementTypes() {
    return useQuery(
        ['measurementTypes'],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                measurementTypes: MeasurementType[];
            }>(`/measurement/types`);
            return data.measurementTypes;
        },
        {
            staleTime: 1000 * 3600
        }
    );
}

export function useDeleteMeasurement() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            measurementId: number;
            skjemaId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `/measurement/${body.measurementId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const measurements = queryClient.getQueryData<Measurement[]>([
                    'measurements',
                    'skjema',
                    vars.skjemaId
                ]);
                // ✅ update detail view directly

                if (measurements && measurements.length > 0) {
                    queryClient.setQueryData(
                        ['measurements', 'skjema', vars.skjemaId],
                        measurements?.filter((a) => a.id !== vars.measurementId)
                    );
                }

                queryClient.invalidateQueries(['measurements']);

                enqueueSnackbar('Måling slettet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                enqueueSnackbar('Kan ikke slette målingen', {
                    variant: 'warning'
                });
            }
        }
    );
}
