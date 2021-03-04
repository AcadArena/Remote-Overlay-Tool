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
  SvgIcon,
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
import { ReactComponent as VsIcon } from "../../comps/assets/vs.svg";
import { green } from "@material-ui/core/colors";
import {
  Participant,
  PlayerStatProps,
  ReduxState,
  Stat,
  StatPlayerVsProps,
} from "../../config/types/types";
import {
  WebsocketProps,
  wsContext,
} from "../../config/websocket/WebsocketProvider";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import TextField from "../../comps/textfield/TextField";
import { Stats } from "fs";

const mcs = makeStyles((theme) => ({
  select: {
    maxHeight: 300,
    // width: 200,
  },
  listsubheader: {
    backgroundColor: "#9c27b0",
    color: "#fff",
  },
  player2: {
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

const StatsPlayerVsPlayer = () => {
  const classes = mcs();
  const { tournament, stat_player_vs } = useSelector(
    (state: ReduxState) => state.live
  );

  const [statInput, setStatInput] = React.useState<string>("Kills");

  const ws = React.useContext(wsContext);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<any>(null);
  const [form, setForm] = React.useState<StatPlayerVsProps>({
    player1: { name: "", ign: "", stats: [] },
    player2: { name: "", ign: "", stats: [] },
    stat_names: [],
  });

  React.useEffect(() => {
    if (stat_player_vs) {
      setForm(stat_player_vs);
    }
  }, [stat_player_vs, setForm]);

  // React.useEffect(() => {
  //   if (form) {
  //     console.log("player1", form.player1);
  //     console.log("player2", form.player2);
  //   }
  // }, [form]);

  const save = () => {
    ws.setLiveSettings({ stat_player_vs: form });
  };

  const addStat = () => {
    setForm({
      ...form,
      stat_names: [...form.stat_names, statInput],
      player1: {
        ...form.player1,
        stats: [
          ...form.player1.stats,
          { stat_name: statInput, stat_value: "", isOn: true },
        ],
      },
      player2: {
        ...form.player2,
        stats: [
          ...form.player2.stats,
          { stat_name: statInput, stat_value: "", isOn: true },
        ],
      },
    });
  };

  const handleStatChange = (player: string, i: number) => ({
    currentTarget: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [player]: {
        ...form[player],
        stats: form[player].stats.map((s: Stat, ii: number) =>
          i === ii ? { ...s, [name]: value } : s
        ),
      },
    });
  };
  const removeStat = (index: number) => () => {
    setForm({
      ...form,
      player1: {
        ...form.player1,
        stats: form.player1.stats.filter((s, i) => i !== index),
      },
      player2: {
        ...form.player2,
        stats: form.player2.stats.filter((s, i) => i !== index),
      },
      stat_names: form.stat_names.filter((s, i) => i !== index),
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
            <SheetHeadTitle>Player Vs Player</SheetHeadTitle>
            <SheetHeadSub>
              goes to{" "}
              <a
                href="http://localhost:3001/playervsplayer"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                /playervsplayer
              </a>
            </SheetHeadSub>
          </div>
          <div className={classes.fabWrapper}>
            <Fab
              color="primary"
              onClick={save}
              disabled={stat_player_vs === form}
            >
              {stat_player_vs === form ? (
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
            Select Player 1
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
              "player1",
              () => setAnchorEl(null)
            ).map((item: any) => item)}
          </Menu>
          <Button
            variant="contained"
            color="secondary"
            style={{ backgroundColor: "#e53935", marginLeft: 15 }}
            onClick={({ currentTarget }) => setAnchorEl2(currentTarget)}
          >
            Select Player 2
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
              "player2",
              () => setAnchorEl2(null)
            ).map((item: any) => item)}
          </Menu>
        </div>
        <SheetSection className={classes.vsSection}>
          <div className={classes.player}>
            <div
              className="logo"
              style={{ backgroundImage: `url(${form.player1.team?.logo})` }}
            ></div>
            {form.player1.photo_main && (
              <div
                className="logo"
                style={{ backgroundImage: `url(${form.player1.photo_main})` }}
              ></div>
            )}
            <div className="info">
              <div className="ign">{form.player1.ign}</div>
              <div className="name">{form.player1.name}</div>
            </div>
          </div>
          <div className={classes.stats}>
            {form.stat_names?.map((stat, i) => (
              <div className="stat" key={i}>
                <Checkbox
                  style={{ paddingTop: 10 }}
                  checked={
                    form.player1.stats[i].isOn && form.player2.stats[i].isOn
                  }
                  onChange={() =>
                    setForm({
                      ...form,
                      player1: {
                        ...form.player1,
                        stats: form.player1.stats.map((s, ii) =>
                          i === ii ? { ...s, isOn: !s.isOn } : s
                        ),
                      },
                      player2: {
                        ...form.player2,
                        stats: form.player2.stats.map((s, ii) =>
                          i === ii ? { ...s, isOn: !s.isOn } : s
                        ),
                      },
                    })
                  }
                />
                <TextField
                  value={form.player1.stats[i].stat_value}
                  name="stat_value"
                  size="small"
                  onChange={handleStatChange("player1", i)}
                  align="right"
                  disabled={!form.player1.stats[i].isOn}
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
                  value={form.player2.stats[i].stat_value}
                  name="stat_value"
                  size="small"
                  disabled={!form.player2.stats[i].isOn}
                  inputProps={{
                    style: {
                      backgroundColor: "rgba(244, 67, 54, .10)",
                    },
                  }}
                  onChange={handleStatChange("player2", i)}
                />
                <IconButton onClick={removeStat(i)}>
                  <DeleteForeverIcon />
                </IconButton>
              </div>
            ))}
          </div>
          <div className={classes.player + " " + classes.player2}>
            <div
              className="logo"
              style={{ backgroundImage: `url(${form.player2.team?.logo})` }}
            ></div>
            {Boolean(form.player1.photo_main) && (
              <div
                className="logo"
                style={{ backgroundImage: `url(${form.player2.photo_main})` }}
              ></div>
            )}
            <div className="info">
              <div className="ign">{form.player2.ign}</div>
              <div className="name">{form.player2.name}</div>
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
  form: StatPlayerVsProps,
  setForm: React.Dispatch<React.SetStateAction<StatPlayerVsProps>>,
  ws: WebsocketProps,
  player: string,
  onClose: () => void
) => {
  const classes = mcs();
  let list: any[] = [];
  participants
    .filter((team) => Boolean(team?.players?.length))
    .forEach((team) => {
      list = [
        ...list,
        <ListSubheader key={team.id} className={classes.listsubheader}>
          {team.display_name}
        </ListSubheader>,
      ];

      team.players?.forEach((p) => {
        list = [
          ...list,
          <MenuItem
            button
            dense
            key={p.ign}
            onClick={() => {
              setForm({
                ...form,
                [player]: { ...p, team, stats: [...form[player].stats] },
              });
              onClose();
            }}
          >
            <ListItemAvatar>
              <Avatar src={p.photo_main} />
            </ListItemAvatar>
            <ListItemText>{p.ign}</ListItemText>
          </MenuItem>,
        ];
      });
    });
  return list;
};

export default StatsPlayerVsPlayer;
