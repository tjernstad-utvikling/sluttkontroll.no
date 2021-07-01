import { Route, Switch } from 'react-router-dom';

import { MainLayout } from '../layout/main';
import Typography from '@material-ui/core/Typography';

export const Main = () => {
    return (
        <MainLayout>
            <Switch>
                <Route path="/">
                    <Typography paragraph>Main screen</Typography>
                </Route>
            </Switch>
        </MainLayout>
    );
};
