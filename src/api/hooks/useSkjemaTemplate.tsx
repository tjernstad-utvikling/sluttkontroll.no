import {
    SkjemaTemplateCheckpoint,
    Template
} from '../../contracts/skjemaTemplateApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useTemplates() {
    return useQuery(['skjemaTemplate'], async () => {
        const { data } = await sluttkontrollApi.get<{
            templates: Template[];
        }>(`/template/`);
        return data.templates;
    });
}

export function useTemplate({ templateId }: { templateId?: number }) {
    return useQuery(
        ['skjemaTemplate', templateId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                template: Template;
            }>(`/template/${templateId}`);
            return data.template;
        },
        {
            enabled: !!templateId
        }
    );
}

export function useNewTemplate() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Template,
        unknown,
        {
            name: string;
            checkpointIds: number[];
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                template: Template;
            }>('/template/', body);
            return data.template;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newTemplate, vars) => {
                const templates = queryClient.getQueryData<Template[]>([
                    'skjemaTemplate'
                ]);
                // ✅ update detail view directly

                if (templates && templates?.length > 0) {
                    queryClient.setQueryData(
                        ['skjemaTemplate'],
                        unionBy([newTemplate], templates, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['skjemaTemplate']);

                enqueueSnackbar('Sjekklistemal lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (
                    error.response.status === 400 &&
                    error.response.message === 'name_missing'
                ) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                }

                enqueueSnackbar('Ukjent feil ved lagring av mal', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useUpdateTemplate() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        SkjemaTemplateCheckpoint[],
        unknown,
        {
            templateId: number;
            name: string;
            checkpointIds: number[];
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                skjemaTemplateCheckpoints: SkjemaTemplateCheckpoint[];
            }>(`/template/${body.templateId}`, {
                name: body.name,
                checkpointIds: body.checkpointIds
            });
            return data.skjemaTemplateCheckpoints;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (skjemaTemplateCheckpoints, vars) => {
                const template = queryClient.getQueryData<Template[]>([
                    'skjemaTemplate',
                    vars.templateId
                ]);
                // ✅ update detail view directly

                if (template) {
                    queryClient.setQueryData(
                        ['skjemaTemplate', vars.templateId],
                        {
                            ...template,
                            name: vars.name,
                            skjemaTemplateCheckpoints
                        }
                    );
                }
                queryClient.invalidateQueries(['skjemaTemplate']);

                enqueueSnackbar('Sjekklistemal lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (
                    error.response.status === 400 &&
                    error.response.message === 'name_missing'
                ) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                }

                enqueueSnackbar('Ukjent feil ved lagring av mal', {
                    variant: 'warning'
                });
            }
        }
    );
}

export function useRemoveTemplate() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            templateId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `/template/${body.templateId}`
            );
            return data.skjemaTemplateCheckpoints;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const templates = queryClient.getQueryData<Template[]>([
                    'skjemaTemplate'
                ]);
                // ✅ update detail view directly

                if (templates && templates.length > 0) {
                    queryClient.setQueryData(
                        ['skjemaTemplate'],
                        templates.filter((t) => t.id !== vars.templateId)
                    );
                }
                queryClient.invalidateQueries(['skjemaTemplate']);

                enqueueSnackbar('Sjekklistemal er slettet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                enqueueSnackbar('Ukjent feil ved sletting av mal', {
                    variant: 'warning'
                });
            }
        }
    );
}
