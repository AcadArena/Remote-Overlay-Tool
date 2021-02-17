import { makeStyles } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Button from "./comps/layout/Button";
import InnerNav from "./comps/layout/InnerNav";
import Nav from "./comps/layout/Nav";
import Control from "./views/dashboard/Control";

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
  return (
    <div className={classes.app}>
      <Nav />
      <div className={classes.mainPanel}>
        <InnerNav />
        <div className="content">
          <Switch>
            <Route exact path="/dashboard"></Route>
            <Route exact path="/schedule"></Route>
            <Route exact path="/bracket"></Route>
            <Route exact path="/control">
              <Control />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
