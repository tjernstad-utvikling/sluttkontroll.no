import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { Main } from "./main";

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <p>Home screen</p>
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
