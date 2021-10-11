import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { Admin } from './admin';
import FrontPage from '../views/public-frontPage';
import { Main } from './main';

export const AppRouter = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <FrontPage />
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
