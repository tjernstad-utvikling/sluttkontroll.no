import { Instrument } from './main/instrument';
import { Kontroll } from './main/kontroll';
import { PrivateRoute } from './privateRoute';
import { Switch } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const Main = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });
    return (
        <Switch>
            <PrivateRoute path="/instrument">
                <Instrument />
            </PrivateRoute>
            <PrivateRoute path="/">
                <Kontroll />
            </PrivateRoute>
        </Switch>
    );
};
