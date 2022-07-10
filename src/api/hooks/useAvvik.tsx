import { Avvik, AvvikBilde } from '../../contracts/avvikApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { User } from '../../contracts/userApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useAvvik({
    includeClosed,
    clientId,
    locationId,
    skjemaId,
    kontrollId,
    myControl
}: {
    includeClosed: boolean;
    clientId?: number;
    locationId?: number;
    skjemaId?: number;
    kontrollId?: number;
    myControl?: boolean;
}) {
    return useQuery(
        [
            'avvik',
            includeClosed ? 'all' : 'open',
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
            const { data } = await sluttkontrollApi.get<{ avvik: Avvik[] }>(
                `/avvik`,
                {
                    params: {
                        ...(includeClosed ? { all: true } : {}),
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
                }
            );
            return data.avvik;
        }
    );
}

export function useAvvikById(avvikId: number | undefined) {
    const queryClient = useQueryClient();
    return useQuery(
        ['avvik', avvikId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ avvik: Avvik }>(
                `/avvik/${avvikId}`
            );
            return data.avvik;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Avvik[]>('avvik')
                    ?.find((a) => a.id === avvikId);
            },

            // The query will not execute until the avvikId exists
            enabled: !!avvikId
        }
    );
}

export function useCloseAvvik({
    isFromDetailsPage
}: {
    isFromDetailsPage?: boolean;
}) {
    const queryClient = useQueryClient();
    return useMutation<
        Avvik[],
        unknown,
        { avvikList: number[]; kommentar: string }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{ avvik: Avvik[] }>(
                '/avvik/close',
                body
            );
            return data.avvik;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updatedAvvik) => {
                if (isFromDetailsPage) {
                    queryClient.setQueryData(
                        ['avvik', updatedAvvik[0].id],
                        updatedAvvik[0]
                    );
                }
                const avvikArray = queryClient.getQueryData<Avvik[]>('avvik');
                // ✅ update detail view directly

                if (avvikArray && avvikArray?.length > 0) {
                    queryClient.setQueryData(
                        'avvik',
                        unionBy(updatedAvvik, avvikArray, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries('avvik');
            }
        }
    );
}

export function useOpenAvvik({
    isFromDetailsPage
}: {
    isFromDetailsPage?: boolean;
}) {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            avvikId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/avvik/open/${body.avvikId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                const _avvik = avvik?.find((a) => a.id === vars.avvikId);

                if (_avvik) {
                    queryClient.setQueryData(
                        ['avvik'],
                        unionBy([{ ..._avvik, status: '' }], avvik, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                    if (isFromDetailsPage) {
                        queryClient.setQueryData(['avvik', vars.avvikId], {
                            ..._avvik,
                            status: ''
                        });
                    }
                }

                queryClient.invalidateQueries(['avvik']);

                enqueueSnackbar('Avvik åpnet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'avvik closed') {
                        enqueueSnackbar('Avvik er lukket og kan ikke slettes', {
                            variant: 'warning'
                        });
                    } else if (
                        error.response.message === 'beskrivelse missing'
                    ) {
                        enqueueSnackbar(
                            'Kan ikke lagre avviket uten beskrivelse',
                            {
                                variant: 'warning'
                            }
                        );
                    } else {
                        enqueueSnackbar('Kan ikke oppdatere avviket', {
                            variant: 'warning'
                        });
                    }
                }
            }
        }
    );
}

export function useNewAvvik() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const newImageMutation = useAddAvvikImage();

    return useMutation<
        Avvik,
        unknown,
        {
            beskrivelse: string;
            kommentar: string;
            utbedrer: User[] | null;
            checklistId: number;
            images: File[];
            discoverLocation: string;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{ avvik: Avvik }>(
                `/avvik/${body.checklistId}`,
                {
                    ...body,
                    utbedrer: body.utbedrer?.map((u) => u.id)
                }
            );
            return data.avvik;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: async (newAvvik, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                if (avvik) {
                    queryClient.setQueryData(
                        ['avvik'],
                        unionBy([newAvvik], avvik, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                if (vars.images.length > 0) {
                    await newImageMutation.mutateAsync({
                        images: vars.images,
                        avvik: newAvvik
                    });
                }

                queryClient.invalidateQueries(['avvik']);

                enqueueSnackbar('Avvik lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Kan ikke lagre avviket', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useAddAvvikImage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        AvvikBilde[],
        unknown,
        {
            images: File[];
            avvik: Avvik;
        }
    >(
        async (body) => {
            const formData = new FormData();

            body.images.forEach((file) => {
                formData.append('images', file);
            });

            const { data } = await sluttkontrollApi.post<{
                avvikBilder: AvvikBilde[];
            }>(`/avvik/bilder/add/${body.avvik.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.avvikBilder;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newAvvikBilder, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                if (avvik) {
                    queryClient.setQueryData(
                        ['avvik'],
                        unionBy(
                            [{ ...vars.avvik, avvikBilder: newAvvikBilder }],
                            avvik,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }

                queryClient.invalidateQueries(['avvik']);
            },
            onError: (error: any) => {
                if (
                    error.response.status === 400 &&
                    error.response.message === 'missing file'
                ) {
                    enqueueSnackbar(
                        'Bildet mangler ved opplastning, prøv igjen eller kontakt support',
                        {
                            variant: 'warning'
                        }
                    );
                } else {
                    enqueueSnackbar('Ukjent feil ved opplastning', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useDeleteAvvikImage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            imageId: number;
            avvik: Avvik;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `/avvik/bilder/${body.imageId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                if (avvik) {
                    queryClient.setQueryData(
                        ['avvik'],
                        unionBy(
                            [
                                {
                                    ...vars.avvik,
                                    avvikBilder: vars.avvik.avvikBilder.filter(
                                        (b) => b.id !== vars.imageId
                                    )
                                }
                            ],
                            avvik,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }

                queryClient.invalidateQueries(['avvik']);
            },
            onError: (error: any) => {
                enqueueSnackbar('Ukjent feil ved sletting', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useDeleteAvvik() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            avvikId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `/avvik/${body.avvikId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                const _avvik = avvik?.find((a) => a.id === vars.avvikId);

                if (_avvik) {
                    queryClient.setQueryData(
                        ['avvik'],
                        avvik?.filter((a) => a.id !== vars.avvikId)
                    );
                }

                queryClient.invalidateQueries(['avvik']);

                enqueueSnackbar('Avvik åpnet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'avvik closed') {
                        enqueueSnackbar('Avvik er lukket og kan ikke slettes', {
                            variant: 'warning'
                        });
                    } else if (
                        error.response.message === 'beskrivelse missing'
                    ) {
                        enqueueSnackbar(
                            'Kan ikke lagre avviket uten beskrivelse',
                            {
                                variant: 'warning'
                            }
                        );
                    } else {
                        enqueueSnackbar('Kan ikke oppdatere avviket', {
                            variant: 'warning'
                        });
                    }
                }
            }
        }
    );
}

export function useAddAvvikImages({
    isFromDetailsPage
}: {
    isFromDetailsPage?: boolean;
}) {
    const queryClient = useQueryClient();
    return useMutation<AvvikBilde[], unknown, { avvik: Avvik; images: File[] }>(
        async ({ avvik, images }) => {
            const formData = new FormData();

            images.forEach((file) => {
                formData.append('images', file);
            });

            const { data } = await sluttkontrollApi.post<{
                avvikBilder: AvvikBilde[];
            }>(`/avvik/bilder/add/${avvik.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return data.avvikBilder;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (avvikBilder, { avvik }) => {
                const avvikArray = queryClient.getQueryData<Avvik[]>('avvik');
                // ✅ update detail view directly

                const updatedAvvik = {
                    ...avvik,
                    avvikBilder: [...avvik.avvikBilder, ...avvikBilder]
                };

                if (isFromDetailsPage) {
                    queryClient.setQueryData(['avvik', avvik.id], updatedAvvik);
                }
                if (avvikArray && avvikArray?.length > 0) {
                    queryClient.setQueryData(
                        'avvik',
                        unionBy([updatedAvvik], avvikArray, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                    return;
                }
                queryClient.invalidateQueries('avvik');
            }
        }
    );
}

export function useUpdateAvvik() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            avvik: Avvik;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/avvik/${body.avvik.id}`,
                {
                    beskrivelse: body.avvik.beskrivelse,
                    kommentar: body.avvik.kommentar,
                    utbedrer: body.avvik.utbedrer.map((u) => u.id)
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                if (avvik && avvik?.length > 0) {
                    queryClient.setQueryData(
                        ['avvik'],
                        unionBy([vars.avvik], avvik, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['avvik']);

                enqueueSnackbar('Avvik lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'avvik closed') {
                        enqueueSnackbar('Avvik er lukket og kan ikke slettes', {
                            variant: 'warning'
                        });
                    } else if (
                        error.response.message === 'beskrivelse missing'
                    ) {
                        enqueueSnackbar(
                            'Kan ikke lagre avviket uten beskrivelse',
                            {
                                variant: 'warning'
                            }
                        );
                    } else {
                        enqueueSnackbar('Kan ikke oppdatere avviket', {
                            variant: 'warning'
                        });
                    }
                }
            }
        }
    );
}

export function useMoveAvvik() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            avvik: Avvik;
            checklistId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/avvik/move/${body.avvik.id}/to/${body.checklistId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updated, vars) => {
                const avvik = queryClient.getQueryData<Avvik[]>(['avvik']);
                // ✅ update detail view directly

                if (avvik && avvik?.length > 0) {
                    queryClient.setQueryData(
                        ['avvik'],
                        unionBy(
                            [
                                {
                                    ...vars.avvik,
                                    checklist: {
                                        ...vars.avvik.checklist,
                                        id: vars.checklistId
                                    }
                                }
                            ],
                            avvik,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries(['avvik']);

                enqueueSnackbar('Avvik lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'avvik closed') {
                        enqueueSnackbar('Avvik er lukket og kan ikke flyttes', {
                            variant: 'warning'
                        });
                    } else {
                        enqueueSnackbar('Kan ikke oppdatere avviket', {
                            variant: 'warning'
                        });
                    }
                }
            }
        }
    );
}

export function useSetRectifier() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            avvikIds: number[];
            utbedrer: User[];
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post(
                '/avvik/set-utbedrere',
                {
                    avvikIds: body.avvikIds,
                    utbedrer: body.utbedrer
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateSkjema, vars) => {
                queryClient.invalidateQueries(['avvik']);

                enqueueSnackbar('Utbedrere er satt', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                enqueueSnackbar('Kan ikke sette utbedrere', {
                    variant: 'warning'
                });
            }
        }
    );
}
