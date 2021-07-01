import { Route, Switch } from 'react-router-dom';

import { KontrollerView } from '../views/kontroller';
import { MainLayout } from '../layout/main';
import Typography from '@material-ui/core/Typography';

export const Main = () => {
    return (
        <MainLayout>
            <Switch>
                <Route path="/">
                    <KontrollerView />
                </Route>
            </Switch>
        </MainLayout>
    );
};
