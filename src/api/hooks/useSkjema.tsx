import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Skjema } from '../../contracts/kontrollApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useSkjemaerByKontrollId(kontrollId: number | undefined) {
    return useQuery(
        ['skjema', 'kontroll', kontrollId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ skjemaer: Skjema[] }>(
                `/skjema`,
                {
                    params: {
                        kontrollId
                    }
                }
            );
            return data.skjemaer;
        },
        {
            // The query will not execute until the kontrollId exists
            enabled: !!kontrollId
        }
    );
}
export function useSkjemaById(skjemaId: number | undefined) {
    const queryClient = useQueryClient();
    return useQuery(
        ['skjema', skjemaId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ skjema: Skjema }>(
                `/skjema/${skjemaId}`
            );
            return data.skjema;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Skjema[]>('skjema')
                    ?.find((s) => s.id === skjemaId);
            },
            // The query will not execute until the kontrollId exists
            enabled: !!skjemaId
        }
    );
}

export function useNewSkjema() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Skjema,
        unknown,
        {
            area: string;
            omrade: string;
            checkpointIds: number[];
            kontrollId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                skjema: Skjema;
            }>(`/skjema/${body.kontrollId}`, body);
            return data.skjema;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newSkjema, vars) => {
                const skjemaer = queryClient.getQueryData<Skjema[]>([
                    'skjema',
                    'kontroll',
                    vars.kontrollId
                ]);
                // ✅ update detail view directly

                if (skjemaer && skjemaer?.length > 0) {
                    queryClient.setQueryData(
                        ['skjema', vars.kontrollId],
                        unionBy([newSkjema], skjemaer, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['skjema']);

                enqueueSnackbar('Nytt skjema lagret', {
                    variant: 'success'
                });
            }
        }
    );
}

export function useUpdateSkjema() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Skjema,
        unknown,
        {
            skjema: Skjema;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `skjema/${body.skjema.id}`,
                {
                    area: body.skjema.area,
                    omrade: body.skjema.omrade,
                    kommentar: body.skjema.kommentar
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                const skjemaer = queryClient.getQueryData<Skjema[]>([
                    'skjema',
                    'kontroll',
                    vars.skjema.kontroll.id
                ]);
                // ✅ update detail view directly

                if (skjemaer && skjemaer?.length > 0) {
                    queryClient.setQueryData(
                        ['skjema', 'kontroll', vars.skjema.kontroll.id],
                        unionBy([vars.skjema], skjemaer, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['skjema']);

                enqueueSnackbar('Skjema lagret', {
                    variant: 'success'
                });
            }
        }
    );
}

export function useRemoveSkjema() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Skjema,
        unknown,
        {
            skjemaId: number;
            kontrollId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `skjema/${body.skjemaId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                const skjemaer = queryClient.getQueryData<Skjema[]>([
                    'skjema',
                    'kontroll',
                    vars.kontrollId
                ]);
                // ✅ update detail view directly

                if (skjemaer && skjemaer?.length > 0) {
                    queryClient.setQueryData(
                        ['skjema', 'kontroll', vars.kontrollId],
                        skjemaer.filter((s) => s.id !== vars.skjemaId)
                    );
                }
                queryClient.invalidateQueries(['skjema']);

                enqueueSnackbar('Skjema slettet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar(
                        'Avvik og måleresultater må slettes først',
                        {
                            variant: 'warning'
                        }
                    );
                }
            }
        }
    );
}

export function useMoveSkjema() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Skjema,
        unknown,
        {
            skjema: Skjema;
            kontrollId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `skjema/move/${body.skjema.id}/to/${body.kontrollId}`
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                const skjemaer = queryClient.getQueryData<Skjema[]>([
                    'skjema',
                    'kontroll',
                    vars.skjema.kontroll.id
                ]);
                // ✅ update detail view directly

                if (skjemaer && skjemaer?.length > 0) {
                    queryClient.setQueryData(
                        ['skjema', 'kontroll', vars.kontrollId],
                        unionBy(
                            [
                                {
                                    ...vars.skjema,
                                    kontroll: {
                                        ...vars.skjema.kontroll,
                                        id: vars.kontrollId
                                    }
                                }
                            ],
                            skjemaer,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries(['skjema']);

                enqueueSnackbar('Skjema flyttet', {
                    variant: 'success'
                });
            }
        }
    );
}
