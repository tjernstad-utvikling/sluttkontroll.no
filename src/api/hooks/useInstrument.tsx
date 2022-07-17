import { Instrument, Kalibrering } from '../../contracts/instrumentApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { User } from '../../contracts/userApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useInstruments({ kontrollId }: { kontrollId?: number }) {
    return useQuery(
        ['instrument', ...(kontrollId ? ['kontroll', kontrollId] : [])],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                instruments: Instrument[];
            }>('/instrument/', {
                params: {
                    ...(kontrollId
                        ? {
                              kontrollId
                          }
                        : {})
                }
            });
            return data.instruments;
        }
    );
}

export function useInstrument({ instrumentId }: { instrumentId?: number }) {
    return useQuery(
        ['instrument', instrumentId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                instrument: Instrument;
            }>(`/instrument/${instrumentId}`, {});
            return data.instrument;
        },
        {
            enabled: !!instrumentId
        }
    );
}

export function useAddInstrument() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Instrument,
        unknown,
        {
            name: string;
            serienr: string;
            user: User | null;
            toCalibrate: boolean;
            calibrationInterval: number;
        }
    >(
        async (body) => {
            const user = body.user ? { id: body.user.id } : null;
            const { data } = await sluttkontrollApi.post<{
                instrument: Instrument;
            }>('/instrument/', {
                ...body,
                user
            });

            return data.instrument;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newInstrument, vars) => {
                const instruments = queryClient.getQueryData<Instrument[]>([
                    'instrument'
                ]);
                // ✅ update detail view directly

                if (instruments && instruments?.length > 0) {
                    queryClient.setQueryData(
                        ['checkpoint'],
                        unionBy([newInstrument], instruments, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Nytt instrument lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Ikke alle nødvendige felter er fylt ut', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Feil ved lagring', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useUpdateInstrument() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            instrument: Instrument;
        }
    >(
        async (body) => {
            const user = body.instrument.user
                ? { id: body.instrument.user.id }
                : null;

            const disponent = body.instrument.disponent
                ? { id: body.instrument.disponent.id }
                : null;

            const { data } = await sluttkontrollApi.put(
                `/instrument/${body.instrument.id}`,
                { ...body.instrument, user, disponent }
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const instruments = queryClient.getQueryData<Instrument[]>([
                    'instrument'
                ]);
                // ✅ update detail view directly

                if (instruments && instruments?.length > 0) {
                    queryClient.setQueryData(
                        ['checkpoint'],
                        unionBy([vars.instrument], instruments, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Instrument lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Ikke alle nødvendige felter er fylt ut', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Feil ved lagring', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useSetInstrumentDisponent() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            instrumentId: number;
            userId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/instrument/disponent/${body.instrumentId}/${body.userId}`
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Instrumentet er booket', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                enqueueSnackbar('Feil ved lagring', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useRemoveInstrumentDisponent() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            instrumentId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/instrument/remove-disponent/${body.instrumentId}`
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Instrumentet er levert', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                enqueueSnackbar('Feil ved lagring', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useAddCalibration() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            instrumentId: number;
            kalibrertDate: string;
            sertifikatFile: File;
        }
    >(
        async (body) => {
            const formData = new FormData();

            formData.append('sertifikatFile', body.sertifikatFile);
            formData.append(
                'data',
                JSON.stringify({
                    kalibrertDate: body.kalibrertDate
                })
            );

            const { data } = await sluttkontrollApi.post(
                `/instrument/calibration/${body.instrumentId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: () => {
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Instrument lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'missing_file') {
                        enqueueSnackbar('Kalibreringsfil mangler', {
                            variant: 'warning'
                        });
                    } else {
                        enqueueSnackbar(
                            'Ikke alle nødvendige felter er fylt ut',
                            {
                                variant: 'warning'
                            }
                        );
                    }
                } else {
                    enqueueSnackbar('Feil ved lagring', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useCurrentUserInstrumentStatus() {
    return useQuery(
        ['instrument', 'statusCurrentUser'],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                dispInstruments: Instrument[];
                ownedInstruments: Instrument[];
            }>('/instrument/calibration/status', {});
            return data;
        },
        {
            staleTime: 1000 * 240
        }
    );
}
export function useCalibrationByInstrument({
    instrumentId
}: {
    instrumentId: number;
}) {
    return useQuery(
        ['instrument', 'calibrations', instrumentId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                calibrations: Kalibrering[];
            }>(`/instrument/kalibrering/${instrumentId}`, {});
            return data.calibrations;
        },
        {
            enabled: !!instrumentId
        }
    );
}
