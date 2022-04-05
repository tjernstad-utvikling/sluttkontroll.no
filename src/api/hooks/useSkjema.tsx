import { Skjema } from '../../contracts/kontrollApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

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
