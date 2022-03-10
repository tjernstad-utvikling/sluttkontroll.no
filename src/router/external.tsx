import ExternalDashboardView from '../views/external-dashboard';
import { ExternalLayout } from '../layout/external';
import { PrivateRoute } from './privateRoute';
import { Roles } from '../contracts/userApi';
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
            <PrivateRoute requiredRole={[Roles.ROLE_LUKKE_AVVIK]} path={`/`}>
                <ExternalLayout>
                    <ExternalDashboardView />
                </ExternalLayout>
            </PrivateRoute>
        </Switch>
    );
};
