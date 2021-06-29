import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { FrontPage } from "../views/frontPage";
import { Main } from "./main";

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <FrontPage />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
