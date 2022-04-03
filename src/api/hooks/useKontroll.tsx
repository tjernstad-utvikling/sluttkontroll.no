import { Checklist, Kontroll, Skjema } from '../../contracts/kontrollApi';

import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

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
            return data;
        }
    );
}
