import { Route, Switch, useRouteMatch } from 'react-router-dom';

import EditTemplate from '../../../views/admin-settings-templateEdit';
import NewTemplate from '../../../views/admin-settings-templateNew';
import { TemplateContextProvider } from '../../../data/skjemaTemplate';
import Templates from '../../../views/admin-settings-templates';

const Template = () => {
    let { path } = useRouteMatch();
    return (
        <TemplateContextProvider>
            <Switch>
                <Route path={`${path}/new`}>
                    <NewTemplate />
                </Route>
                <Route path={`${path}/:templateId`}>
                    <EditTemplate />
                </Route>
                <Route path={`${path}`}>
                    <Templates />
                </Route>
            </Switch>
        </TemplateContextProvider>
    );
};

export default Template;
