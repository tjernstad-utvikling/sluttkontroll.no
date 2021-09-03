import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { TemplateContextProvider } from '../../../data/skjemaTemplate';
import Templates from '../../../views/admin-settings-templates';

const Template = () => {
    let { path } = useRouteMatch();
    return (
        <TemplateContextProvider>
            <Switch>
                {/* <Route path={`${path}/info-text`}>
                <InfoTextView />
            </Route> */}

                <Route path={`${path}`}>
                    <Templates />
                </Route>
            </Switch>
        </TemplateContextProvider>
    );
};

export default Template;
