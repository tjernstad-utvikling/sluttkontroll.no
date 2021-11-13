import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { Admin } from './admin';
import ForgotPasswordPage from '../views/public-passwordForgot';
import FrontPage from '../views/public-frontPage';
import { Main } from './main';
import PasswordResetPage from '../views/public-passwordReset';

export const AppRouter = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <FrontPage />
                    </Route>
                    <Route path="/forgot-password">
                        <ForgotPasswordPage />
                    </Route>
                    <Route path="/password/reset/:token?">
                        <PasswordResetPage />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                    <Route path="/">
                        <Main />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};
