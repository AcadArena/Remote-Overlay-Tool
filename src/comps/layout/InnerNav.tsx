import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { makeStyles, Toolbar, Typography } from "@material-ui/core";

interface RouteMap {
  [key: string]: string;
}

const routeMap: RouteMap = {
  bracket: "Bracket",
  dashboard: "Dashboard",
  control: "Control Panel",
  schedule: "Stream Schedule",
};

const makeComponentStyles = makeStyles((theme) => ({
  appbar: {
    boxShadow: "none",
    "& .page-title": {
      fontWeight: 300,
      fontSize: 18,
      padding: theme.spacing(0, 3),
    },
  },
}));

const InnerNav: React.FC<RouteComponentProps> = ({
  location: { pathname },
}) => {
  const classes = makeComponentStyles();
  return (
    <AppBar position="static" color="transparent" className={classes.appbar}>
      <Toolbar>
        <Typography variant="h5" className="page-title">
          {routeMap[pathname.split("/")[1]]}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(InnerNav);
