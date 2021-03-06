import { Forms } from './main/forms';
import { Instrument } from './main/instrument';
import { Kontroll } from './main/kontroll';
import { PrivateRoute } from './privateRoute';
import { Roles } from '../contracts/userApi';
import { Switch } from 'react-router-dom';
import { User } from './main/user';

export const Main = () => {
    return (
        <Switch>
            <PrivateRoute
                requiredRole={[Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]}
                path="/instrument">
                <Instrument />
            </PrivateRoute>
            <PrivateRoute
                requiredRole={[Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]}
                path="/forms">
                <Forms />
            </PrivateRoute>
            <PrivateRoute
                requiredRole={[Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]}
                path="/user">
                <User />
            </PrivateRoute>
            <PrivateRoute
                path="/"
                requiredRole={[Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]}>
                <Kontroll />
            </PrivateRoute>
        </Switch>
    );
};
