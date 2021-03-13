import React from "react";

import Drawer from "@material-ui/core/Drawer";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import GamesIcon from "@material-ui/icons/Games";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import GroupIcon from "@material-ui/icons/Group";
import StorageIcon from "@material-ui/icons/Storage";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import BarChartIcon from "@material-ui/icons/BarChart";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import { ReactComponent as BattleIcon } from "../assets/battle.svg";
import LinkIcon from "@material-ui/icons/Link";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import { withRouter, RouteComponentProps } from "react-router-dom";
import clsx from "clsx";
import { Participant, ReduxState } from "../../config/types/types";
import { useSelector } from "react-redux";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";

const drawerWdith = 260;

const makeComponentStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWdith,
    flexShrink: 0,
    [theme.breakpoints.down("md")]: {
      width: 100,
    },
  },
  drawerPaper: {
    width: drawerWdith,
    [theme.breakpoints.down("md")]: {
      width: 100,
    },
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
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
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
  ws: {},
  popover: {
    "& .headline": {
      padding: theme.spacing(3, 3, 0, 3),
    },
  },
  winner: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    margin: "10px 0",
    padding: 10,
    borderRadius: 5,
    border: "1px solid rgba(0,0,0,.2)",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    "& .teams": {
      display: "flex",
    },
  },
}));

const navData = [
  { title: "Tournaments", url: "/tournaments", icon: <StorageIcon /> },
  { title: "Participants", url: "/participants", icon: <GroupIcon /> },
  {
    title: "Matches",
    url: "/matches",
    // icon: (
    //   <SvgIcon>
    //     <BattleIcon />
    //   </SvgIcon>
    // ),
    icon: <AccountTreeIcon style={{ transform: "scaleX(-1)" }} />,
  },
  // {
  //   title: "Bracket",
  //   url: "/bracket",
  //   icon: <AccountTreeIcon style={{ transform: "scaleX(-1)" }} />,
  // },
  { title: "Casters", url: "/casters", icon: <HeadsetMicIcon /> },
  { title: "Lower Thirds", url: "/lowerthirds", icon: <CallToActionIcon /> },
  { title: "State", url: "/state", icon: <ControlCameraIcon /> },
  { title: "Stats", url: "/stats", icon: <BarChartIcon /> },
  // { title: "Container", url: "/container", icon: <ChromeReaderModeIcon /> },
  { title: "Links", url: "/links", icon: <LinkIcon /> },
];

const Nav: React.FC<RouteComponentProps> = ({
  history,
  location: { pathname },
}) => {
  const classes = makeComponentStyles();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const {
    websocket_users,
    room,
    swap_team_positions = false,
    match,
    tournament,
    match_winner,
  } = useSelector((state: ReduxState) => state.live);
  const [selected, setSelected] = React.useState<Participant | undefined>();

  const ws = React.useContext(wsContext);

  const team = (id: number) => {
    return tournament?.participants?.find(
      (p) => p.id === id || p.group_player_ids.includes(id)
    );
  };

  const goLive = () => {
    ws.setLiveSettings({
      match_winner: {
        live: true,
        team: selected,
      },
    });
  };

  const clear = () => {
    ws.setLiveSettings({
      match_winner: {
        live: false,
        team: selected,
      },
    });
    setSelected(undefined);
  };

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      PaperProps={{ variant: "elevation", elevation: 10 }}
    >
      <>
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

        <div style={{ padding: 20 }}>
          <div className={classes.winner}>
            <Typography variant="h4">Round Winner</Typography>

            <div className="teams">
              <Button
                onClick={() => setSelected(team(match?.player1_id ?? 0))}
                variant={
                  selected === team(match?.player1_id ?? 0)
                    ? "outlined"
                    : "text"
                }
              >
                {team(match?.player1_id ?? 0)?.org_name}
              </Button>
              <Button
                onClick={() => setSelected(team(match?.player2_id ?? 0))}
                variant={
                  selected === team(match?.player2_id ?? 0)
                    ? "outlined"
                    : "text"
                }
              >
                {team(match?.player2_id ?? 0)?.org_name}
              </Button>
            </div>

            <div
              style={{ margin: 10, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="caption">Double click to go live</Typography>
              <Button
                color={match_winner?.live ? "secondary" : "primary"}
                variant="contained"
                onDoubleClick={goLive}
                disabled={!Boolean(selected)}
              >
                Go Live
              </Button>
              <Button variant="outlined" onClick={clear}>
                clear
              </Button>
            </div>
          </div>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            style={{
              backgroundColor: swap_team_positions ? "#e53935" : "#8e24aa",
            }}
            onClick={() =>
              ws.setLiveSettings({ swap_team_positions: !swap_team_positions })
            }
          >
            Switch Sides
          </Button>
        </div>

        <Button
          className={classes.ws}
          onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
        >
          Websocket Connection
        </Button>
        <Popover
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          classes={{ paper: classes.popover }}
        >
          <Typography variant="subtitle2" className="headline">
            Room: {room}
          </Typography>
          <List className="list">
            {websocket_users.map((user) => (
              <ListItem dense key={user.id}>
                <ListItemText
                  primary={user.username}
                  secondary={user.id}
                  primaryTypographyProps={{ style: { fontWeight: "normal" } }}
                  secondaryTypographyProps={{ style: { fontSize: 12 } }}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      </>
    </Drawer>
  );
};

export default withRouter(Nav);
