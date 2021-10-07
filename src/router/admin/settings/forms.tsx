import { Route, Switch, useRouteMatch } from 'react-router-dom';

import FormsTemplateNewView from '../../../views/admin-settings-forms-templateNew';
import FormsTemplatesView from '../../../views/admin-settings-forms-templates';

const Forms = () => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/new`}>
                <FormsTemplateNewView />
            </Route>
            <Route path={`${path}`}>
                <FormsTemplatesView />
            </Route>
        </Switch>
    );
};

export default Forms;
