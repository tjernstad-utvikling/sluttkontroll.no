import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Instrument } from '../../contracts/instrumentApi';
import { User } from '../../contracts/userApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useInstruments() {
    return useQuery(['instrument'], async () => {
        const { data } = await sluttkontrollApi.get<{
            instruments: Instrument[];
        }>('/instrument/', {});
        return data.instruments;
    });
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
