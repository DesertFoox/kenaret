import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Account from "../../Container/Account";
import Broadcast from "../../Screens/GoLive/GoLive";
import HomePage from "../../Components/HomePage/HomePage";
import Login from "../../Screens/Authentication/Authentication";
import NotFound from "../../Components/NotFound";
const AuthenticationApp = () => {
  return (
    <Switch>
      <Route
        exact
        path="/main/e-commerce/pipes/:streamId?"
        component={HomePage}
      />
      <Route exact path="/account" component={Account} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/notfound" component={NotFound} />
      <Route exact path="/broadcast" component={Broadcast} />

      <Redirect from="/" to="/main/e-commerce/pipes/" />
      <Redirect from="/main" to="/main/e-commerce/pipes/" />
      <Redirect to="/notfound" />
    </Switch>
  );
};

export default AuthenticationApp;
