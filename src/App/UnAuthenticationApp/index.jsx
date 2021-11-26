import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Login from "../../Screens/Authentication/Authentication";
import HomePage from "../../Components/HomePage/HomePage";
import Broadcast from "../../Screens/GoLive/GoLiveUnAuth";
import App from "../../Container/App";
import NotFound from "../../Components/NotFound";
import Account from "../../Container/Account";

const UnAuthenticationApp = () => {
  return (
    <Switch>
      <Route
        exact
        path="/main/e-commerce/pipes/:streamId?"
        component={HomePage}
      />
      <Route exact path="/login" component={Login} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/broadcast" component={Broadcast} />
      <Route exact path="/notfound" component={NotFound} />

      <Redirect exact from="/main" to="/main/e-commerce/pipes/" />
      <Redirect exact from="/" to="/main/e-commerce/pipes/" />
      <Redirect to="/notfound"/>

    </Switch>
  );
};

export default UnAuthenticationApp;
