import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core";
import Button from "./comps/layout/Button";
import InnerNav from "./comps/layout/InnerNav";
import Nav from "./comps/layout/Nav";
import Control from "./views/control/Control";
import Settings from "./views/settings/Settings";
import { ReduxState } from "./config/types/types";
import Tournaments from "./views/tournaments/Tournaments";

const makeComponentStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    height: "100vh",
    width: "100vw",
  },
  mainPanel: {
    height: "100%",
    flex: 1,
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",

    "& .content": {
      flex: 1,
      padding: theme.spacing(6),
    },
  },
}));

function App() {
  const classes = makeComponentStyles();

  const { tournament } = useSelector((state: ReduxState) => state.live);

  return (
    <div className={classes.app}>
      <Nav />
      <div className={classes.mainPanel}>
        {tournament ? (
          <>
            <InnerNav />
            <div className="content">
              <Switch>
                <Route exact path="/tournaments">
                  <Tournaments />
                </Route>
                <Route exact path="/participants"></Route>
                <Route exact path="/schedule"></Route>
                <Route exact path="/bracket"></Route>
                <Route exact path="/settings">
                  <Settings />
                </Route>
                <Route exact path="/control">
                  <Control />
                </Route>
              </Switch>
            </div>
          </>
        ) : (
          <>
            <Redirect to="/tournaments" />
            <Tournaments />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
