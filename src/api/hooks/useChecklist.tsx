import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Checklist } from '../../contracts/kontrollApi';
import { Checkpoint } from '../../contracts/checkpointApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useChecklistsBySkjemaId({
    skjemaId,
    kontrollId
}: {
    skjemaId?: number | undefined;
    kontrollId?: number | undefined;
}) {
    return useQuery(
        [
            'checklist',
            ...(kontrollId
                ? ['location', kontrollId]
                : skjemaId
                ? ['client', skjemaId]
                : [])
        ],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                checklists: Checklist[];
            }>(`/checklist`, {
                params: {
                    ...(kontrollId
                        ? { kontrollId }
                        : skjemaId
                        ? { skjemaId }
                        : {})
                }
            });
            return data.checklists;
        },
        {
            // The query will not execute until the kontrollId exists
            enabled: !!skjemaId
        }
    );
}

export function useChecklistById(checklistId: number | undefined) {
    const queryClient = useQueryClient();
    return useQuery(
        ['checklist', checklistId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                checklist: Checklist;
            }>(`/checklist/${checklistId}`);
            return data.checklist;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Checklist[]>('checklist')
                    ?.find((s) => s.id === checklistId);
            },
            // The query will not execute until the kontrollId exists
            enabled: !!checklistId
        }
    );
}

export function useUpdateChecklist() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Checklist[],
        unknown,
        {
            skjemaId: number;
            checkpoints: Checkpoint[];
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put<{
                checklists: Checklist[];
            }>(`/checklist/${body.skjemaId}`, {
                checkpointIds: body.checkpoints.map((c) => c.id)
            });
            return data.checklists;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateChecklists, vars) => {
                const checklists = queryClient.getQueryData<Checklist[]>([
                    'checklist',
                    'skjema',
                    vars.skjemaId
                ]);
                // ✅ update detail view directly

                if (checklists && checklists?.length > 0) {
                    queryClient.setQueryData(
                        ['checklist', 'skjema', vars.skjemaId],
                        unionBy(updateChecklists, checklists, 'id')
                    );
                }
                queryClient.invalidateQueries([
                    'checklist',
                    'skjema',
                    vars.skjemaId
                ]);

                enqueueSnackbar('Sjekkliste lagret', {
                    variant: 'success'
                });
            }
        }
    );
}
export function useToggleApplicable() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            checklist: Checklist;
            applicable: boolean;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/checklist/aktuell/${body.checklist.id}/${
                    body.applicable ? 1 : 0
                }`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updateChecklists, vars) => {
                const checklists = queryClient.getQueryData<Checklist[]>([
                    'checklist',
                    'skjema',
                    vars.checklist.skjema.id
                ]);
                // ✅ update detail view directly

                if (checklists && checklists?.length > 0) {
                    queryClient.setQueryData(
                        ['checklist', 'skjema', vars.checklist.skjema.id],
                        unionBy(
                            [{ ...vars.checklist, aktuell: vars.applicable }],
                            checklists,
                            'id'
                        )
                    );
                }
                queryClient.invalidateQueries([
                    'checklist',
                    'skjema',
                    vars.checklist.skjema.id
                ]);

                enqueueSnackbar('Sjekkliste lagret', {
                    variant: 'success'
                });
            }
        }
    );
}
