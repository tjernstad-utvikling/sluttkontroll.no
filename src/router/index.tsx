import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import FrontPage from '../views/public-frontPage';
import { Instrument } from './instrument';
import { Main } from './main';
import { PrivateRoute } from './privateRoute';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const AppRouter = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <FrontPage />
                    </Route>
                    <PrivateRoute path="/instrument">
                        <Instrument />
                    </PrivateRoute>
                    <PrivateRoute path="/">
                        <Main />
                    </PrivateRoute>
                </Switch>
            </div>
        </Router>
    );
};
