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
import { ReactComponent as PlayerIcon } from "../../comps/assets/player.svg";
import { green } from "@material-ui/core/colors";
import {
  Participant,
  PlayerStatProps,
  ReduxState,
  Stat,
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
  player: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    "& .logo": {
      height: 85,
      width: 85,
      border: "1px solid rgba(0,0,0,.1)",
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
  statAdd: {
    marginTop: 40,
    display: "flex",
    "& .input": {
      marginRight: theme.spacing(2),
    },
  },
  stats: {
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

const StatsPlayer = () => {
  const classes = mcs();
  const { tournament, stat_player } = useSelector(
    (state: ReduxState) => state.live
  );
  const [statInput, setStatInput] = React.useState<string>("Kills");

  const ws = React.useContext(wsContext);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [form, setForm] = React.useState<PlayerStatProps>({
    name: "",
    ign: "",
    stats: [
      {
        stat_name: "Stat1",
        stat_value: "Value",
        isOn: true,
      },
    ],
  });

  React.useEffect(() => {
    if (stat_player) {
      setForm(stat_player);
    }
  }, [stat_player, setForm]);

  // React.useEffect(() => {
  //   if (form) {
  //     console.log(form);
  //   }
  // }, [form]);

  const save = () => {
    ws.setLiveSettings({ stat_player: form });
  };

  const addStat = () => {
    setForm({
      ...form,
      stats: [
        ...form.stats,
        { stat_name: statInput, stat_value: "", isOn: true },
      ],
    });
  };

  const handleStatChange = (s: Stat, i: number) => ({
    currentTarget: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      stats: form.stats.map((stat, ii) =>
        stat === s && ii === i ? { ...stat, [name]: value } : stat
      ),
    });
  };

  const removeStat = (s: Stat, i: number) => () => {
    setForm({
      ...form,
      stats: form.stats.filter((ss, ii) => ss !== s && ii !== i),
    });
  };

  return (
    <Sheet>
      <SheetHead
        icon={
          <SvgIcon fontSize="large">
            <PlayerIcon />
          </SvgIcon>
        }
      >
        <div className={classes.headWrapper}>
          <div style={{ flex: 1 }}>
            <SheetHeadTitle>Individual Player Stats</SheetHeadTitle>
            <SheetHeadSub>
              goes to{" "}
              <a
                href="http://localhost:3001/player"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                /player
              </a>
            </SheetHeadSub>
          </div>
          <div className={classes.fabWrapper}>
            <Fab color="primary" onClick={save} disabled={stat_player === form}>
              {stat_player === form ? (
                <CheckIcon fontSize="large" />
              ) : (
                <SaveOutlinedIcon fontSize="large" />
              )}
            </Fab>
          </div>
        </div>
      </SheetHead>
      <SheetBody>
        <Button
          variant="contained"
          color="primary"
          onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
        >
          Select Player
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
            () => setAnchorEl(null)
          ).map((item: any) => item)}
        </Menu>
        <SheetSection className={classes.player}>
          <div
            className="logo"
            style={{ backgroundImage: `url(${form.team?.logo})` }}
          ></div>
          <div
            className="logo"
            style={{ backgroundImage: `url(${form.photo_main})` }}
          ></div>
          <div className="info">
            <div className="ign">{form.ign}</div>
            <div className="name">{form.name}</div>
          </div>
        </SheetSection>
        <div className={classes.stats}>
          {form.stats?.map((stat, i) => (
            <div className="stat" key={i}>
              <Checkbox
                checked={stat.isOn}
                onChange={() =>
                  setForm({
                    ...form,
                    stats: form.stats.map((s: Stat, ii: number) =>
                      s === s && i === ii ? { ...s, isOn: !s.isOn } : s
                    ),
                  })
                }
              />
              <TextField
                value={stat.stat_name}
                label="Property"
                name="stat_name"
                size="small"
                onChange={handleStatChange(stat, i)}
              />
              <TextField
                value={stat.stat_value}
                label="Value"
                name="stat_value"
                size="small"
                onChange={handleStatChange(stat, i)}
              />
              <IconButton onClick={removeStat(stat, i)}>
                <DeleteForeverIcon />
              </IconButton>
            </div>
          ))}
        </div>

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
  form: PlayerStatProps,
  setForm: React.Dispatch<React.SetStateAction<PlayerStatProps>>,
  ws: WebsocketProps,
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
              setForm({ ...form, ...p, team });
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

export default StatsPlayer;
