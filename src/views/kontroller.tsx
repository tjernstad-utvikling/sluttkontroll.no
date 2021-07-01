import { getClients } from '../api/kontrollApi';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const KontrollerView = () => {
    useEffectOnce(async () => {
        console.log(await getClients());
    });
    return <div></div>;
};
