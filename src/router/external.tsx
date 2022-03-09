import ExternalDashboardView from '../views/external-dashboard';
import { PrivateRoute } from './privateRoute';
import { Switch } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const External = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });

    return (
        <Switch>
            <PrivateRoute path={`/`}>
                <ExternalDashboardView />
            </PrivateRoute>
        </Switch>
    );
};
