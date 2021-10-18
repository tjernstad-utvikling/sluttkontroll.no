import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { CreateFormsContainer } from '../../../components/forms';
import { FormsContextProvider } from '../../../data/forms';
import FormsTemplateEditView from '../../../views/admin-settings-forms-templateEdit';
import FormsTemplateNewView from '../../../views/admin-settings-forms-templateNew';
import FormsTemplatesView from '../../../views/admin-settings-forms-templates';

const Forms = () => {
    let { path } = useRouteMatch();
    return (
        <FormsContextProvider>
            <Switch>
                <Route path={`${path}/new`}>
                    <CreateFormsContainer>
                        <FormsTemplateNewView />
                    </CreateFormsContainer>
                </Route>
                <Route path={`${path}/:templateId`}>
                    <CreateFormsContainer>
                        <FormsTemplateEditView />
                    </CreateFormsContainer>
                </Route>
                <Route path={`${path}`}>
                    <FormsTemplatesView />
                </Route>
            </Switch>
        </FormsContextProvider>
    );
};

export default Forms;
