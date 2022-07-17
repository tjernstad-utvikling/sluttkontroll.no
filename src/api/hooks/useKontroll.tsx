import {
    Checklist,
    Kontroll,
    Location,
    ReportKontroll,
    Skjema
} from '../../contracts/kontrollApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { RapportEgenskaper } from '../../contracts/reportApi';
import { User } from '../../contracts/userApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useExternalKontroller() {
    return useQuery('externalKontroll', async () => {
        const { data } = await sluttkontrollApi.get<{
            kontroller: Kontroll[];
            skjemaer: Skjema[];
            checklists: Checklist[];
        }>(`/kontroll/access-by-external`);
        return data;
    });
}

export function useKontroller({
    includeDone,
    clientId,
    locationId
}: {
    includeDone: boolean;
    clientId?: number;
    locationId?: number;
}) {
    return useQuery(
        [
            'kontroll',
            includeDone ? 'all' : 'open',
            ...(locationId
                ? ['location', locationId]
                : clientId
                ? ['client', clientId]
                : [])
        ],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                kontroller: Kontroll[];
            }>(`/kontroll`, {
                params: {
                    ...(includeDone ? { all: true } : {}),
                    ...(locationId
                        ? { locationId }
                        : clientId
                        ? { clientId }
                        : {})
                }
            });
            return data.kontroller;
        }
    );
}

export function useKontrollById(kontrollId: number | undefined) {
    const queryClient = useQueryClient();
    return useQuery(
        ['kontroll', kontrollId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ kontroll: Kontroll }>(
                `/kontroll/${kontrollId}`
            );
            return data.kontroll;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Kontroll[]>('kontroll')
                    ?.find((k) => k.id === kontrollId);
            },

            // The query will not execute until the userId exists
            enabled: !!kontrollId
        }
    );
}
export function useReportKontrollById(kontrollId: number | undefined) {
    return useQuery(
        ['kontroll', kontrollId, 'isReport'],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                kontroll: ReportKontroll;
            }>(`/kontroll/${kontrollId}/report-data`);
            return data.kontroll;
        },
        {
            // The query will not execute until the userId exists
            enabled: !!kontrollId
        }
    );
}

export function useUpdateReportKontroll() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        ReportKontroll,
        unknown,
        {
            kontrollId: number;
            reportProperties: RapportEgenskaper;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                kontroll: ReportKontroll;
            }>(`/report/properties/${body.kontrollId}`, {
                ...body.reportProperties,
                rapportUser: body.reportProperties.rapportUser?.id,
                sertifikater: body.reportProperties.sertifikater.map((s) => {
                    return {
                        id: s.id
                    };
                })
            });
            return data.kontroll;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updatedKontroll, vars) => {
                const kontroller = queryClient.getQueryData<Kontroll[]>([
                    'kontroll',
                    vars.kontrollId,
                    'isReport'
                ]);
                // ✅ update detail view directly

                if (kontroller && kontroller?.length > 0) {
                    queryClient.setQueryData(
                        ['kontroll', vars.kontrollId, 'isReport'],
                        unionBy([updatedKontroll], kontroller, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries([
                    'kontroll',
                    vars.kontrollId,
                    'isReport'
                ]);

                enqueueSnackbar('Rapportegenskaper er oppdatert', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Et eller flere felter mangler data', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar(
                        'Problemer med lagring av kontrollegenskaper',
                        {
                            variant: 'error'
                        }
                    );
                }
            }
        }
    );
}
export function useUpdateKontroll() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Kontroll,
        unknown,
        {
            id: number;
            name: string;
            user: { id: number };
            avvikUtbedrere: {
                id: number;
            }[];
            kommentar: string;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put<{ kontroll: Kontroll }>(
                `/kontroll/${body.id}`,
                {
                    ...body,
                    user: { id: body.user.id },
                    avvikUtbedrere: body.avvikUtbedrere.map((u) => {
                        return { id: u.id };
                    })
                }
            );
            return data.kontroll;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updatedKontroll) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                if (kontroller && kontroller?.length > 0) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy([updatedKontroll], kontroller, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries('kontroll');

                enqueueSnackbar('Kontroll oppdatert', {
                    variant: 'success'
                });
            }
        }
    );
}
export function useUpdateKontrollInstrumentConnection() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        { id: number }[],
        unknown,
        {
            kontrollId: number;
            instrumentIds: number[];
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                instrumenter: { id: number }[];
            }>(`/instrument/set-kontroll`, {
                ...body
            });
            return data.instrumenter;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (data, vars) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                const kontroll = kontroller?.find(
                    (k) => k.id === vars.kontrollId
                );

                if (kontroller && kontroller?.length > 0 && kontroll) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy(
                            [{ ...kontroll, instrumenter: data }],
                            kontroller,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries('kontroll');
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Instrumenter koblet til kontroll', {
                    variant: 'success'
                });
            }
        }
    );
}
export function useUpdateKontrollRemoveInstrumentConnection() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            kontrollId: number;
            instrumentId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put<any>(
                `/instrument/disconnect-kontroll/${body.instrumentId}/${body.kontrollId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                const kontroll = kontroller?.find(
                    (k) => k.id === vars.kontrollId
                );

                if (kontroller && kontroller?.length > 0 && kontroll) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy(
                            [
                                {
                                    ...kontroll,
                                    instrumenter: kontroll.instrumenter.filter(
                                        (i) => i.id !== vars.instrumentId
                                    )
                                }
                            ],
                            kontroller,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries('kontroll');
                queryClient.invalidateQueries(['instrument']);

                enqueueSnackbar('Instrumenter koblet til kontroll', {
                    variant: 'success'
                });
            }
        }
    );
}

export function useNewKontroll() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Kontroll,
        unknown,
        {
            name: string;
            avvikUtbedrere: User[];
            location: Location;
            user: User;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                kontroll: Kontroll;
            }>(`/kontroll/${body.location.id}/${body.user.id}`, {
                name: body.name,
                avvikUtbedrere: [
                    ...body.avvikUtbedrere.map((u) => {
                        return { id: u.id };
                    })
                ]
            });
            return data.kontroll;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newKontroll) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                if (kontroller && kontroller?.length > 0) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy([newKontroll], kontroller, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries('kontroll');

                enqueueSnackbar('Ny kontroll lagret', {
                    variant: 'success'
                });
            }
        }
    );
}

export function useMoveKontroll() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Kontroll,
        unknown,
        {
            kontroll: Kontroll;
            locationId: number;
            klientId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `kontroll/move/${body.kontroll.id}/to/${body.locationId}`
            );

            return data.kontroll;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (data, vars) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                if (kontroller && kontroller?.length > 0) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy(
                            [
                                {
                                    ...vars.kontroll,
                                    location: {
                                        id: vars.locationId,
                                        klient: { id: vars.klientId }
                                    }
                                }
                            ],
                            kontroller,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries('kontroll');

                enqueueSnackbar('Kontroll flyttet', {
                    variant: 'success'
                });
            }
        }
    );
}
export function useToggleKontrollStatus() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Kontroll,
        unknown,
        {
            kontroll: Kontroll;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/kontroll/status/${body.kontroll.id}`
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (data, vars) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                if (kontroller && kontroller?.length > 0) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy(
                            [
                                {
                                    ...vars.kontroll,
                                    done: !vars.kontroll.done
                                }
                            ],
                            kontroller,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries('kontroll');

                enqueueSnackbar('Kontroll er oppdatert', {
                    variant: 'success'
                });
            }
        }
    );
}
