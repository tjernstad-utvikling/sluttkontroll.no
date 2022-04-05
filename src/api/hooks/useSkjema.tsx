import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Skjema } from '../../contracts/kontrollApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useSkjemaerByKontrollId(kontrollId: number | undefined) {
    return useQuery(
        ['skjema', kontrollId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ skjemaer: Skjema[] }>(
                `/skjema/${kontrollId}`
            );
            return data.skjemaer;
        },
        {
            // The query will not execute until the kontrollId exists
            enabled: !!kontrollId
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
                queryClient.invalidateQueries(['skjema', vars.kontrollId]);

                enqueueSnackbar('Nytt skjema lagret', {
                    variant: 'success'
                });
            }
        }
    );
}
