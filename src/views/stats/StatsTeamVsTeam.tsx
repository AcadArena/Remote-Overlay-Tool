import {
  Button,
  makeStyles,
  Menu,
  ListSubheader,
  MenuItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Fab,
  CircularProgress,
  SvgIcon,
  Typography,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetFooter from "../../comps/sheet/SheetFooter";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import CheckIcon from "@material-ui/icons/Check";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { ReactComponent as VsIcon } from "../../comps/assets/battle.svg";
import { green } from "@material-ui/core/colors";
import {
  Participant,
  ReduxState,
  Stat,
  StatPlayerVsProps,
  TeamStatProps,
  TeamVsProps,
} from "../../config/types/types";
import {
  WebsocketProps,
  wsContext,
} from "../../config/websocket/WebsocketProvider";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import TextField from "../../comps/textfield/TextField";

const mcs = makeStyles((theme) => ({
  select: {
    maxHeight: 300,
    // width: 200,
  },
  listsubheader: {
    backgroundColor: "#9c27b0",
    color: "#fff",
  },
  team2: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(244, 67, 54, .10)!important",
    "& .logo": {
      marginLeft: 20,
    },
    "& .info": {
      "& .ign": { textAlign: "right" },
      "& .name": {
        textAlign: "right",
      },
    },
  },
  player: {
    margin: theme.spacing(2, 0),
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(5),
    backgroundColor: "rgba(156, 39, 176, .1)",
    borderRadius: 10,
    "& .logo": {
      height: 85,
      width: 85,
      borderRadius: 3,
      marginRight: 20,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "& .info": {
      "& .ign": {
        fontWeight: "bold",
        fontSize: "1.2rem",
      },
      "& .name": {
        fontSize: "1rem",
      },
    },
  },
  headWrapper: {
    display: "flex",
    alignItems: "center",
    "& h5": {
      flex: 1,
    },
  },
  fabWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  vsSection: {
    display: "flex",
    flexDirection: "column",
  },

  vs: { alignSelf: "center", padding: "10px 0", fontWeight: "bold" },

  statAdd: {
    marginTop: 40,
    display: "flex",
    "& .input": {
      marginRight: theme.spacing(2),
    },
  },
  stats: {
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    "& .stat": {
      display: "flex",
      alignItems: "center",
      "& > *": {
        marginRight: 10,
      },
    },
  },
}));

const StatsTeamVsTeam = () => {
  const classes = mcs();
  const { tournament, stat_team_vs } = useSelector(
    (state: ReduxState) => state.live
  );
  const ws = React.useContext(wsContext);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<any>(null);
  const [form, setForm] = React.useState<TeamVsProps | any>({
    stat_names: [],
  });

  const [statInput, setStatInput] = React.useState<string>("Kills");

  React.useEffect(() => {
    if (stat_team_vs) {
      setForm(stat_team_vs);
    }
  }, [stat_team_vs, setForm]);

  // React.useEffect(() => {
  //   if (form) {
  //     console.log(form);
  //   }
  // }, [form]);

  const save = () => {
    ws.setLiveSettings({ stat_team_vs: form });
  };

  const addStat = () => {
    setForm({
      ...form,
      stat_names: [...form.stat_names, statInput],
      team1: {
        ...form.team1,
        stats: [
          ...form.team1.stats,
          { stat_name: statInput, stat_value: "", isOn: true },
        ],
      },
      team2: {
        ...form.team2,
        stats: [
          ...form.team2.stats,
          { stat_name: statInput, stat_value: "", isOn: true },
        ],
      },
    });
  };

  const handleStatChange = (team: string, i: number) => ({
    currentTarget: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [team]: {
        ...form[team],
        stats: form[team].stats.map((s: Stat, ii: number) =>
          i === ii ? { ...s, [name]: value } : s
        ),
      },
    });
  };
  const removeStat = (index: number) => () => {
    setForm({
      ...form,
      team1: {
        ...form.team1,
        stats: form.team1.stats.filter((s: Stat, i: number) => i !== index),
      },
      team2: {
        ...form.team2,
        stats: form.team2.stats.filter((s: Stat, i: number) => i !== index),
      },
      stat_names: form.stat_names.filter((s: Stat, i: number) => i !== index),
    });
  };

  return (
    <Sheet>
      <SheetHead
        icon={
          <SvgIcon fontSize="large">
            <VsIcon />
          </SvgIcon>
        }
      >
        <div className={classes.headWrapper}>
          <div style={{ flex: 1 }}>
            <SheetHeadTitle>Team Vs Team</SheetHeadTitle>
            <SheetHeadSub>
              goes to{" "}
              <a
                href="http://localhost:3001/teamvsteam"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                /teamvsteam
              </a>
            </SheetHeadSub>
          </div>
          <div className={classes.fabWrapper}>
            <Fab
              color="primary"
              onClick={save}
              disabled={stat_team_vs === form}
            >
              {stat_team_vs === form ? (
                <CheckIcon fontSize="large" />
              ) : (
                <SaveOutlinedIcon fontSize="large" />
              )}
            </Fab>
          </div>
        </div>
      </SheetHead>
      <SheetBody>
        <div style={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
          >
            Select Team 1
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            classes={{ paper: classes.select }}
          >
            {SelectionItems(
              tournament?.participants ?? [],
              form,
              setForm,
              ws,
              "team1",
              () => setAnchorEl(null)
            ).map((item: any) => item)}
          </Menu>
          <Button
            variant="contained"
            color="secondary"
            style={{ backgroundColor: "#e53935", marginLeft: 15 }}
            onClick={({ currentTarget }) => setAnchorEl2(currentTarget)}
          >
            Select Team 2
          </Button>
          <Menu
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={() => setAnchorEl2(null)}
            classes={{ paper: classes.select }}
          >
            {SelectionItems(
              tournament?.participants ?? [],
              form,
              setForm,
              ws,
              "team2",
              () => setAnchorEl2(null)
            ).map((item: any) => item)}
          </Menu>
        </div>
        <SheetSection className={classes.vsSection}>
          <div className={classes.player}>
            <div
              className="logo"
              style={{ backgroundImage: `url(${form.team1?.logo})` }}
            ></div>
            <div className="info">
              <div className="ign">{form.team1?.org_name}</div>
              <div className="name">{form.team1?.university_name}</div>
            </div>
          </div>

          <div className={classes.stats}>
            {form.stat_names?.map((stat: string, i: number) => (
              <div className="stat" key={i}>
                <Checkbox
                  style={{ paddingTop: 10 }}
                  checked={form.team1.stats[i].isOn && form.team2.stats[i].isOn}
                  onChange={() =>
                    setForm({
                      ...form,
                      team1: {
                        ...form.team1,
                        stats: form.team1.stats.map((s: Stat, ii: number) =>
                          i === ii ? { ...s, isOn: !s.isOn } : s
                        ),
                      },
                      team2: {
                        ...form.team2,
                        stats: form.team2.stats.map((s: Stat, ii: number) =>
                          i === ii ? { ...s, isOn: !s.isOn } : s
                        ),
                      },
                    })
                  }
                />
                <TextField
                  value={form.team1.stats[i].stat_value}
                  name="stat_value"
                  size="small"
                  onChange={handleStatChange("team1", i)}
                  align="right"
                  disabled={!form.team1.stats[i].isOn}
                  inputProps={{
                    style: {
                      textAlign: "right",
                      backgroundColor: "rgba(156, 39, 176, .1)",
                    },
                  }}
                />
                <div
                  style={{ paddingTop: 10, width: 100, textAlign: "center" }}
                >
                  {stat}
                </div>
                <TextField
                  value={form.team2.stats[i].stat_value}
                  name="stat_value"
                  size="small"
                  disabled={!form.team2.stats[i].isOn}
                  inputProps={{
                    style: {
                      backgroundColor: "rgba(244, 67, 54, .10)",
                    },
                  }}
                  onChange={handleStatChange("team2", i)}
                />
                <IconButton onClick={removeStat(i)}>
                  <DeleteForeverIcon />
                </IconButton>
              </div>
            ))}
          </div>

          <div className={classes.player + " " + classes.team2}>
            <div
              className="logo"
              style={{ backgroundImage: `url(${form.team2?.logo})` }}
            ></div>
            <div className="info">
              <div className="ign">{form.team2?.org_name}</div>
              <div className="name">{form.team2?.university_name}</div>
            </div>
          </div>
        </SheetSection>

        <div className={classes.statAdd}>
          <TextField
            value={statInput}
            label="Stat name"
            className="input"
            size="small"
            onChange={({ currentTarget: { value } }) => setStatInput(value)}
          />
          <Button variant="outlined" onClick={addStat}>
            Add Stat
          </Button>
        </div>
      </SheetBody>
      <SheetFooter>
        This is different from the player displayed in lower thirds
      </SheetFooter>
    </Sheet>
  );
};

const SelectionItems = (
  participants: Participant[],
  form: TeamVsProps,
  setForm: React.Dispatch<React.SetStateAction<TeamVsProps>>,
  ws: WebsocketProps,
  teamNumber: string,
  onClose: () => void
) => {
  const classes = mcs();
  let list: any[] = [];
  return participants.map((team) => (
    <MenuItem
      button
      dense
      key={team.id}
      onClick={() => {
        setForm({
          ...form,
          [teamNumber]: {
            ...team,
            stats: [...(form[teamNumber]?.stats ?? [])],
          },
        });
        onClose();
      }}
    >
      <ListItemAvatar>
        <Avatar src={team.logo} />
      </ListItemAvatar>
      <ListItemText>{team.display_name}</ListItemText>
    </MenuItem>
  ));
};

export default StatsTeamVsTeam;
