import React from "react";

import Drawer from "@material-ui/core/Drawer";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import GamesIcon from "@material-ui/icons/Games";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { withRouter, RouteComponentProps } from "react-router-dom";

const drawerWdith = 260;

const makeComponentStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWdith,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWdith,
  },
  nav: {
    padding: theme.spacing(4),
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  navItem: {
    margin: theme.spacing(1, 0),
    borderRadius: 3,

    "& .text": {
      fontSize: 14,
      fontWeight: 300,
    },
  },
  currentProject: {
    justifySelf: "flex-end",
    alignSelf: "flex-end",
  },
}));

const navData = [
  { title: "Dashboard", url: "/dashboard", icon: <DashboardIcon /> },
  { title: "Schedule", url: "/schedule", icon: <ScheduleIcon /> },
  { title: "Bracket", url: "/bracket", icon: <AccountTreeIcon /> },
  { title: "Control", url: "/control", icon: <GamesIcon /> },
];

const Nav: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = makeComponentStyles();
  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      PaperProps={{ variant: "elevation", elevation: 10 }}
    >
      <List component="nav" className={classes.nav}>
        {navData.map((data) => (
          <ListItem
            button
            className={classes.navItem}
            onClick={() => history.push(data.url)}
          >
            <ListItemIcon>{data.icon}</ListItemIcon>
            <ListItemText
              primary={data.title}
              primaryTypographyProps={{ className: "text" }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default withRouter(Nav);
