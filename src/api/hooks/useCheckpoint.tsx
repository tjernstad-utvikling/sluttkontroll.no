import { Checkpoint } from '../../contracts/checkpointApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

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
