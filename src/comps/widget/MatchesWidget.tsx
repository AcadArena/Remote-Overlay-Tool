import React from "react";
import Sheet from "../sheet/Sheet";
import SheetBody from "../sheet/SheetBody";
import SheetHead from "../sheet/SheetHead";
import SheetHeadTitle from "../sheet/SheetHeadTitle";
import { ReactComponent as BattleIcon } from "../assets/battle.svg";
import SheetSection from "../sheet/SheetSection";
import { useSelector } from "react-redux";
import InfoIcon from "@material-ui/icons/Info";
import { Match, ReduxState } from "../../config/types/types";
import {
  makeStyles,
  SvgIcon,
  Typography,
  Box,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import ControlMatchPopup from "../dialogs/MatchPopup";
import SheetFooter from "../sheet/SheetFooter";
import swal from "sweetalert";
import { wsContext } from "../../config/websocket/WebsocketProvider";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box paddingTop={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const mcs = makeStyles((theme) => ({
  widget: {
    position: "fixed",
    bottom: 20,
    right: 20,
    display: "",
    height: "auto",
    zIndex: 2000,
    // filter: "drop-shadow(-4px 4px 8px rgba(0,0,0,.1))",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  head: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  title: {
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  body: {
    overflow: "hidden",
  },
  section: {},
  match: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0px",
    padding: "10px 0",
    width: 420,
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    transition: "150ms ease-out",
    "&:hover": {
      backgroundColor: "#eee",
    },

    "& .info": {
      borderRight: "1px solid rgba(0,0,0,.1)",
      width: 30,
      textAlign: "center",
      padding: "5px 20px",
    },
    "& .score": {
      borderRight: "1px solid rgba(0,0,0,.1)",
      width: 80,
      textAlign: "center",
      padding: "5px 20px",
    },
    "& .left": {
      justifyContent: "flex-end",
    },
    "& .teams": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,

      "& .team": {
        width: 150,
        display: "flex",
        alignItems: "center",
        padding: "0px 20px",
        "& .logo": {
          height: 50,
          width: 50,
          margin: "0px 10px",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "drop-shadow(0px 4px 4px rgba(0,0,0,.25))",
        },
      },
    },
  },

  schedule: {
    display: "flex",
    flexDirection: "column",
    width: 420,
    maxHeight: 250,
    overflowY: "auto",
    // overflowX: "hidden",

    "&::-webkit-scrollbar": {
      width: 8,
      height: 8,

      "&-thumb": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4,
      },
    },
  },
}));

export const getFinalScore = (score: string) => {
  const scores: string[] = score.split(",");
  let team1: number = 0;
  let team2: number = 0;

  scores.forEach((s) => {
    let ss = s.match(/^(\d*)-(\d*)/);
    if (ss && parseInt(ss[1]) > parseInt(ss[2])) {
      team1 = team1 + 1;
    } else if (ss && parseInt(ss[1]) < parseInt(ss[2])) {
      team2 = team2 + 1;
    }
  });
  return `${team1} - ${team2}`;
};

const MatchesWidget = () => {
  const c = mcs();
  const { match: matchWS, matches_today, tournament } = useSelector(
    (state: ReduxState) => state.live
  );
  const [matchDialogState, setMatchDialogState] = React.useState<boolean>(
    false
  );
  const [matchSelected, setMatchSelected] = React.useState<Match | undefined>();
  const [state, setState] = React.useState<boolean>(true);
  const ws = React.useContext(wsContext);

  const openMatchDialog = (m?: Match) => ({ ctrlKey }: React.MouseEvent) => {
    if (ctrlKey) {
      swal({
        title: "Remove match schedule?",
        icon: "warning",
        dangerMode: true,
        buttons: ["Cancel", true],
      }).then((value) => {
        if (value) {
          ws.setLiveSettings({
            matches_today: matches_today?.filter((mm) => mm.id !== m?.id),
          });
        }
      });
    } else {
      setMatchSelected(m);
      setMatchDialogState(true);
    }
  };

  const toggle = () => {
    setState(!state);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const team = (id: number) => {
    return tournament?.participants?.find(
      (p) => p.id === id || p.group_player_ids.includes(id)
    );
  };

  return (
    <Sheet
      className={c.widget}
      style={{ padding: state ? "" : 0, zIndex: matchDialogState ? 0 : 1000 }}
    >
      <SheetHead
        icon={
          <SvgIcon>
            <BattleIcon />
          </SvgIcon>
        }
        style={{ width: state ? "" : 84, margin: state ? "" : 0 }}
        color="green"
        onClick={toggle}
        className={c.head}
      >
        <SheetHeadTitle
          className={c.title}
          style={{ opacity: state ? 1 : 0, width: state ? "" : 1 }}
        >
          {"Matches & Schedule"}
        </SheetHeadTitle>
      </SheetHead>
      <SheetBody
        className={c.body}
        style={{
          maxHeight: state ? 500 : 0,
          maxWidth: state ? 500 : 0,
          margin: state ? 20 : 0,
        }}
      >
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Match" {...a11yProps(0)} />
            <Tab label="Schedule" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <div className={c.match} onClick={openMatchDialog(matchWS)}>
            {/* <div className="info">
              {match?.group_id ? "G" : "P"}R{match?.round} 
           </div> */}
            <div className="score">
              {getFinalScore(matchWS?.scores_csv ?? "0-0")}
            </div>
            <div className="teams">
              <div className="team left">
                <div className="school">
                  {team(matchWS?.player1_id ?? 0)?.org_acronym}
                </div>
                <div
                  className="logo"
                  style={{
                    backgroundImage: `url(${
                      team(matchWS?.player1_id ?? 0)?.logo
                    })`,
                  }}
                ></div>
              </div>
              <div className="vs">vs</div>
              <div className="team right">
                <div
                  className="logo"
                  style={{
                    backgroundImage: `url(${
                      team(matchWS?.player2_id ?? 0)?.logo
                    })`,
                  }}
                ></div>
                <div className="school">
                  {team(matchWS?.player2_id ?? 0)?.org_acronym}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={c.schedule}>
            {matches_today?.map((match) => (
              <div
                className={c.match}
                key={match.id}
                onClick={openMatchDialog(match)}
              >
                {/* <div className="info">{match?.suggested_play_order}</div> */}
                <div className="score">
                  {getFinalScore(match?.scores_csv ?? "0-0")}
                </div>
                <div className="teams">
                  <div className="team left">
                    <div className="school">
                      {team(match?.player1_id ?? 0)?.org_acronym}
                    </div>
                    <div
                      className="logo"
                      style={{
                        backgroundImage: `url(${
                          team(match?.player1_id ?? 0)?.logo
                        })`,
                      }}
                    ></div>
                  </div>
                  <div className="vs">vs</div>
                  <div className="team right">
                    <div
                      className="logo"
                      style={{
                        backgroundImage: `url(${
                          team(match?.player2_id ?? 0)?.logo
                        })`,
                      }}
                    ></div>
                    <div className="school">
                      {team(match?.player2_id ?? 0)?.org_acronym}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
        {/* <SheetSection className={c.section}>.schedule</SheetSection> */}
      </SheetBody>
      <ControlMatchPopup
        onClose={() => setMatchDialogState(false)}
        open={matchDialogState}
        title={`${team(matchSelected?.player1_id ?? 0)?.org_name} VS ${
          team(matchSelected?.player2_id ?? 0)?.org_name
        }`}
        match={matchSelected}
      ></ControlMatchPopup>
      {state && (
        <SheetFooter>
          <InfoIcon />
          <strong>[ CTRL + CLICK ]:</strong>&nbsp;Remove match from schedule
        </SheetFooter>
      )}
    </Sheet>
  );
};

export default MatchesWidget;
