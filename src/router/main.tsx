import { Route, Switch } from "react-router-dom";

import { MainLayout } from "../layout/main";

export const Main = () => {
  return (
    <MainLayout>
      <Switch>
        <Route path="/">
          <p>Main screen</p>
        </Route>
      </Switch>
    </MainLayout>
  );
};
