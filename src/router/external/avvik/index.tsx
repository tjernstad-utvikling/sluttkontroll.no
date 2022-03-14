import { Route, Switch, useRouteMatch } from 'react-router-dom';

import AvvikPageView from '../../../views/external-avvikPage';

export const Avvik = () => {
    let { path } = useRouteMatch();
    console.log('avvik', { path });
    return (
        <Switch>
            <Route path={`${path}/:avvikId`}>
                <AvvikPageView />
            </Route>
        </Switch>
    );
};
