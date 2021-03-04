import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core";
import Button from "./comps/layout/Button";
import InnerNav from "./comps/layout/InnerNav";
import Nav from "./comps/layout/Nav";
import Control from "./views/lowerthirds/Control";
import Settings from "./views/casters/CastersPage";
import { ReduxState } from "./config/types/types";
import Tournaments from "./views/tournaments/Tournaments";
import ParticipantsPage from "./views/participants/ParticipantsPage";
import MatchesPage from "./views/matches/MatchesPage";
import StatsPage from "./views/stats/StatsPage";
import WebsocketDialog from "./comps/connection/WebsocketDialog";
import { wsContext } from "./config/websocket/WebsocketProvider";
import TimerPage from "./views/timer/TimerPage";

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
  const ws = React.useContext(wsContext);
  const { tournament, websocket_users } = useSelector(
    (state: ReduxState) => state.live
  );

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
                <Route exact path="/participants">
                  <ParticipantsPage />
                </Route>
                <Route exact path="/matches">
                  <MatchesPage />
                </Route>
                <Route exact path="/schedule"></Route>
                <Route exact path="/casters">
                  <Settings />
                </Route>
                <Route exact path="/lowerthirds">
                  <Control />
                </Route>
                <Route exact path="/timer">
                  <TimerPage />
                </Route>
                <Route exact path="/stats">
                  <StatsPage />
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

        <WebsocketDialog
          open={
            websocket_users.findIndex((user) => user.id === ws.socket?.id) ===
            -1
          }
        />
      </div>
    </div>
  );
}

export default App;
