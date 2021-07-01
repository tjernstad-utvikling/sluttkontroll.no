import { Route, Switch } from 'react-router-dom';

import { KontrollerView } from '../views/kontroller';
import { MainLayout } from '../layout/main';

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
