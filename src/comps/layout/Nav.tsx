import React from "react";

import Drawer from "@material-ui/core/Drawer";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  SvgIcon,
} from "@material-ui/core";
import GamesIcon from "@material-ui/icons/Games";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ScheduleIcon from "@material-ui/icons/Schedule";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import StorageIcon from "@material-ui/icons/Storage";
import { ReactComponent as BattleIcon } from "../assets/battle.svg";

import { withRouter, RouteComponentProps } from "react-router-dom";
import clsx from "clsx";

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
    transition: "150ms ease",

    "& .text": {
      fontSize: 14,
      fontWeight: 300,
    },
  },
  navItemActive: {
    backgroundColor: "#9c27b0",
    boxShadow:
      "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(156, 39, 176, .40)",

    "& .text": {
      color: "#fff",
    },
    "& .icon": {
      color: "#fff",
    },

    "&:hover": {
      backgroundColor: "rgba(156, 39, 176, .40)",
    },
  },
  currentProject: {
    justifySelf: "flex-end",
    alignSelf: "flex-end",
  },
}));

const navData = [
  { title: "Tournaments", url: "/tournaments", icon: <StorageIcon /> },
  { title: "Participants", url: "/participants", icon: <GroupIcon /> },
  {
    title: "Matches",
    url: "/matches",
    icon: (
      <SvgIcon>
        <BattleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Bracket",
    url: "/bracket",
    icon: <AccountTreeIcon style={{ transform: "scaleX(-1)" }} />,
  },
  { title: "Settings", url: "/settings", icon: <SettingsIcon /> },
  { title: "Control", url: "/control", icon: <GamesIcon /> },
];

const Nav: React.FC<RouteComponentProps> = ({
  history,
  location: { pathname },
}) => {
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
            key={data.title}
            button
            className={clsx([
              classes.navItem,
              { [classes.navItemActive]: pathname.includes(data.url) },
            ])}
            onClick={() => history.push(data.url)}
          >
            <ListItemIcon className="icon">{data.icon}</ListItemIcon>
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
