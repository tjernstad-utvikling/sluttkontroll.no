import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { FormsContextProvider } from '../../../data/forms';
import FormsTemplateNewView from '../../../views/admin-settings-forms-templateNew';
import FormsTemplatesView from '../../../views/admin-settings-forms-templates';

const Forms = () => {
    let { path } = useRouteMatch();
    return (
        <FormsContextProvider>
            <Switch>
                <Route path={`${path}/new`}>
                    <FormsTemplateNewView />
                </Route>
                <Route path={`${path}`}>
                    <FormsTemplatesView />
                </Route>
            </Switch>
        </FormsContextProvider>
    );
};

export default Forms;
