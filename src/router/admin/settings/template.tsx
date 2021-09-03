import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Templates from '../../../views/admin-settings-templates';

const Template = () => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            {/* <Route path={`${path}/info-text`}>
                <InfoTextView />
            </Route> */}

            <Route path={`${path}`}>
                <Templates />
            </Route>
        </Switch>
    );
};

export default Template;
