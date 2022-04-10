import {
    Checklist,
    Kontroll,
    Location,
    ReportKontroll,
    Skjema
} from '../../contracts/kontrollApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
                { ...body }
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
                avvikUtbedrere: body.avvikUtbedrere
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
