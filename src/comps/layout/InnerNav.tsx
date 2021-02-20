import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { ReduxState } from "../../config/types/types";

interface RouteMap {
  [key: string]: string;
}

const routeMap: RouteMap = {
  bracket: "Bracket",
  participants: "Participants",
  control: "Control Panel",
  schedule: "Stream Schedule",
  settings: "Settings",
  tournaments: "Tournaments",
};

const makeComponentStyles = makeStyles((theme) => ({
  appbar: {
    boxShadow: "none",
    "& .page-title": {
      fontWeight: 300,
      // fontSize: 18,
      padding: theme.spacing(0, 3),
      display: "flex",
      alignItems: "center",
      "& .tournament": {
        // marginRight: theme.spacing(2),
        padding: theme.spacing(2, 1),
      },
    },
  },
}));

const InnerNav: React.FC<RouteComponentProps> = ({
  location: { pathname },
  history,
}) => {
  const classes = makeComponentStyles();

  const { tournament } = useSelector((state: ReduxState) => state.live);
  return (
    <AppBar position="static" color="transparent" className={classes.appbar}>
      <Toolbar>
        <Typography variant="button" className="page-title">
          {Boolean(tournament?.url) &&
            pathname.split("/")[1] !== "tournaments" && (
              <Button
                className="tournament"
                color="primary"
                onClick={() => history.push("/tournaments")}
              >
                {tournament?.url}
              </Button>
            )}
          / {routeMap[pathname.split("/")[1]]}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(InnerNav);
