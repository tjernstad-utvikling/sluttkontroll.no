import { Checklist } from '../../contracts/kontrollApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useChecklistsBySkjemaId(skjemaId: number | undefined) {
    return useQuery(
        ['checklist', 'skjema', skjemaId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                checklists: Checklist[];
            }>(`/checklist/skjema/${skjemaId}`);
            return data.checklists;
        },
        {
            // The query will not execute until the kontrollId exists
            enabled: !!skjemaId
        }
    );
}
