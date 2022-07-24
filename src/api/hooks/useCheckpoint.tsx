import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Checkpoint } from '../../contracts/checkpointApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useCheckpoints() {
    return useQuery(['checkpoint'], async () => {
        const { data } = await sluttkontrollApi.get<{
            checkpoints: Checkpoint[];
        }>(`/checkpoint/`, {});
        return data.checkpoints.sort((a, b) =>
            String(a.prosedyreNr).localeCompare(
                String(b.prosedyreNr),
                undefined,
                { numeric: true, sensitivity: 'base' }
            )
        );
    });
}

export function useAddCheckpoint() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Checkpoint,
        unknown,
        {
            prosedyre: string;
            prosedyreNr: string;
            tekst: string;
            mainCategory: string;
            groupCategory: number;
            checkpointNumber: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                checkpoint: Checkpoint;
            }>(`/checkpoint/`, body);

            return data.checkpoint;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newCheckpoint, vars) => {
                const checkpoints = queryClient.getQueryData<Checkpoint[]>([
                    'checkpoint'
                ]);
                // ✅ update detail view directly

                if (checkpoints && checkpoints?.length > 0) {
                    queryClient.setQueryData(
                        ['checkpoint'],
                        unionBy([newCheckpoint], checkpoints, 'id').sort(
                            (a, b) =>
                                String(a.prosedyreNr).localeCompare(
                                    String(b.prosedyreNr),
                                    undefined,
                                    { numeric: true, sensitivity: 'base' }
                                )
                        )
                    );
                }
                queryClient.invalidateQueries(['checkpoint']);

                enqueueSnackbar('Sjekkpunkt er lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Et eller flere felter mangler', {
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

export function useUpdateCheckpoint() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            checkpointId: number;
            prosedyre: string;
            prosedyreNr: string;
            tekst: string;
            mainCategory: string;
            groupCategory: number;
            checkpointNumber: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/checkpoint/${body.checkpointId}`,
                body
            );

            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const checkpoints = queryClient.getQueryData<Checkpoint[]>([
                    'checkpoint'
                ]);
                // ✅ update detail view directly

                const checkpoint = checkpoints?.find(
                    (c) => c.id === vars.checkpointId
                );

                if (checkpoint) {
                    queryClient.setQueryData(
                        ['checkpoint'],
                        unionBy(
                            [{ ...checkpoint, ...vars }],
                            checkpoints,
                            'id'
                        ).sort((a, b) =>
                            String(a.prosedyreNr).localeCompare(
                                String(b.prosedyreNr),
                                undefined,
                                { numeric: true, sensitivity: 'base' }
                            )
                        )
                    );
                }
                queryClient.invalidateQueries(['checkpoint']);

                enqueueSnackbar('Sjekkpunkt er lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Et eller flere felter mangler', {
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
