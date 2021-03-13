import {
  Button,
  Dialog,
  makeStyles,
  MenuItem,
  Typography,
  Menu,
  ListItemAvatar,
  ListItem,
  Avatar,
  ListItemText,
  Breadcrumbs,
  IconButton,
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  Match,
  ReduxState,
  ValorantMap,
  VetoItem,
} from "../../config/types/types";
import AscentMap from "../../comps/assets/ascent.jpeg";
import BindMap from "../../comps/assets/bind.jpeg";
import HavenMap from "../../comps/assets/haven.jpeg";
import IceboxMap from "../../comps/assets/icebox.jpeg";
import SplitMap from "../../comps/assets/split.jpeg";
import AddIcon from "@material-ui/icons/Add";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import { projectFirestore } from "../../config/firebase/config";
import swal from "sweetalert";
const mcs = makeStyles((theme) => ({
  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  add: {
    display: "flex",
  },
  veto: {
    display: "flex",
    flexDirection: "column",
  },
  flex: {
    display: "flex",
    alignItems: "center",

    "& .name": {
      color: "#000",
      paddingLeft: 10,
    },
  },
}));

const maps = {
  ascent: AscentMap,
  bind: BindMap,
  haven: HavenMap,
  icebox: IceboxMap,
  split: SplitMap,
};

const ControlMatchPopupVeto: React.FC<{
  open: boolean;
  onClose: () => void;
  match?: Match;
  title?: string;
}> = ({ open, onClose, match: matchLocal, title }) => {
  const c = mcs();
  const [match, setMatch] = React.useState<any | undefined>(matchLocal);
  const { tournament, match: matchWS, matches_today } = useSelector(
    (state: ReduxState) => state.live
  );
  const [form, setForm] = React.useState<VetoItem>({
    team: {
      org_name: "",
      university_name: "",
      university_acronym: "",
      logo: "",
    },
    type: "ban",
    map: "ascent",
  });
  const ws = React.useContext(wsContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const teamSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const mapSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const closeMapSelection = () => {
    setAnchorEl2(null);
  };
  const closeTeamSelection = () => {
    setAnchorEl(null);
  };

  const mapPool: ("ascent" | "bind" | "haven" | "icebox" | "split")[] = [
    "ascent",
    "bind",
    "haven",
    "icebox",
    "split",
  ];

  const team = (id?: number) => {
    return tournament?.participants.find((p) =>
      p.group_player_ids.includes(id ?? 0)
    );
  };

  const team1 = {
    org_name: team(match?.player1_id)?.org_name ?? "",
    university_name: team(match?.player1_id)?.university_name ?? "",
    university_acronym: team(match?.player1_id)?.university_acronym ?? "",
    logo: team(match?.player1_id)?.logo ?? "",
  };

  const team2 = {
    org_name: team(match?.player2_id)?.org_name ?? "",
    university_name: team(match?.player2_id)?.university_name ?? "",
    university_acronym: team(match?.player2_id)?.university_acronym ?? "",
    logo: team(match?.player2_id)?.logo ?? "",
  };

  const auto = {
    org_name: "AUTO",
    university_name: "AUTO",
    university_acronym: "AUTO",
    logo: "",
  };

  const changeType = () => {
    setForm({ ...form, type: form.type === "ban" ? "pick" : "ban" });
  };

  const selectTeam = (team: {
    org_name: string;
    university_name: string;
    university_acronym: string;
    logo: string;
  }) => () => {
    setForm({ ...form, team: team });
    closeTeamSelection();
  };

  const selectMap = (map: ValorantMap) => () => {
    setForm({ ...form, map: map });
    closeMapSelection();
  };

  const add = () => {
    setLoading(true);
    projectFirestore
      .collection("tournaments")
      .doc(tournament?.url)
      .set({
        ...tournament,
        matches: tournament?.matches.map((m) =>
          m.id === match?.id ? { ...m, veto: [...(m.veto ?? []), form] } : m
        ),
      })
      .then(() => {
        setLoading(false);
        ws.setLiveSettings({
          tournament: {
            ...tournament,
            matches: tournament?.matches.map((m) =>
              m.id === match?.id ? { ...m, veto: [...(m.veto ?? []), form] } : m
            ),
          },
          match:
            matchWS?.id === match?.id
              ? { ...matchWS, veto: [...(matchWS?.veto ?? []), form] }
              : matchWS,
          matches_today: matches_today?.map((m) =>
            m.id === match?.id ? { ...m, veto: [...(m.veto ?? []), form] } : m
          ),
        });
        setMatch({ ...match, veto: [...(match.veto ?? []), form] });
      })
      .catch((err) => {
        setLoading(false);
        swal({ title: "Something Went Wrong", icon: "error" });
      });
  };

  const deleteVetoItem = (index: number, item: VetoItem) => {
    setLoading(true);
    projectFirestore
      .collection("tournaments")
      .doc(tournament?.url)
      .set({
        ...tournament,
        matches: tournament?.matches.map((m) =>
          m.id === match?.id
            ? {
                ...m,
                veto: [
                  ...(m.veto?.filter((v, i) => v !== item && i !== index) ??
                    []),
                ],
              }
            : m
        ),
      })
      .then(() => {
        setLoading(false);
        ws.setLiveSettings({
          tournament: {
            ...tournament,
            matches: tournament?.matches.map((m) =>
              m.id === match?.id
                ? {
                    ...m,
                    veto: [
                      ...(m.veto?.filter((v, i) => v !== item && i !== index) ??
                        []),
                    ],
                  }
                : m
            ),
          },
          match:
            matchWS?.id === match?.id
              ? {
                  ...matchWS,
                  veto: [
                    ...(matchWS?.veto?.filter(
                      (v, i) => v !== item && i !== index
                    ) ?? []),
                  ],
                }
              : matchWS,
          matches_today: matches_today?.map((m) =>
            m.id === match?.id
              ? {
                  ...m,
                  veto: [
                    ...(m.veto?.filter((v, i) => v !== item && i !== index) ??
                      []),
                  ],
                }
              : m
          ),
        });
        setMatch({
          ...match,
          veto: [
            ...(match?.veto?.filter(
              (v: VetoItem, i: number) => v !== item && i !== index
            ) ?? []),
          ],
        });
      })
      .catch((err) => {
        setLoading(false);
        swal({ title: "Something Went Wrong", icon: "error" });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: c.paper }}>
      <Sheet loading={loading}>
        <SheetHead>
          <SheetHeadTitle>Veto</SheetHeadTitle>
          <SheetHeadSub>{title}</SheetHeadSub>
        </SheetHead>
        <SheetBody>
          <SheetSection style={{ border: "1px solid rgba(0,0,0,.5)" }}>
            <Typography variant="h4">Veto</Typography>
            <div className={c.veto}>
              {Boolean(match?.veto?.length) ? (
                match?.veto?.map((v: VetoItem, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "10px 0px",
                    }}
                  >
                    <Breadcrumbs separator={<NavigateNextIcon />}>
                      <div className={c.flex}>
                        <Avatar variant="rounded" src={v.team.logo} />
                        <div className="name">
                          {v.team.university_acronym} | {v.team.org_name}
                        </div>
                      </div>
                      <div className={c.flex}>
                        {v.type === "ban" ? (
                          <CancelIcon />
                        ) : (
                          <CheckCircleIcon />
                        )}
                        <div className="name">{v.type}</div>
                      </div>
                      <div className={c.flex}>
                        <Avatar variant="rounded" src={maps[v.map]} />
                        <div className="name">{v.map}</div>
                      </div>
                    </Breadcrumbs>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <IconButton onClick={() => deleteVetoItem(i, v)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px 0" }}>No Veto Yet</div>
              )}
            </div>
          </SheetSection>

          <Typography variant="caption">Add Veto</Typography>
          <div className={c.add}>
            <Button
              variant="outlined"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={teamSelection}
              style={{ width: 225, justifyContent: "flex-start" }}
              startIcon={<Avatar variant="rounded" src={form.team.logo} />}
            >
              {Boolean(form.team.org_name) ? form.team.org_name : "Select Team"}
            </Button>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={closeTeamSelection}
            >
              <ListItem button onClick={selectTeam(team1)}>
                <ListItemAvatar>
                  <Avatar src={team1.logo} />
                </ListItemAvatar>
                <ListItemText>{team1.org_name}</ListItemText>
              </ListItem>
              <ListItem button onClick={selectTeam(team2)}>
                <ListItemAvatar>
                  <Avatar variant="rounded" src={team2.logo} />
                </ListItemAvatar>
                <ListItemText>{team2.org_name}</ListItemText>
              </ListItem>
              <ListItem button onClick={selectTeam(auto)}>
                <ListItemAvatar>
                  <Avatar variant="rounded" src={auto.logo} />
                </ListItemAvatar>
                <ListItemText>{auto.org_name}</ListItemText>
              </ListItem>
            </Menu>

            <Button
              variant="outlined"
              style={{ width: 100 }}
              startIcon={
                form.type === "ban" ? <CancelIcon /> : <CheckCircleIcon />
              }
              color={form.type === "ban" ? "secondary" : "primary"}
              onClick={changeType}
            >
              {form.type}
            </Button>
            <Button
              variant="outlined"
              aria-controls="simple-menu2"
              aria-haspopup="true"
              onClick={mapSelection}
              style={{ flex: 1, justifyContent: "flex-start" }}
              startIcon={
                <Avatar variant="rounded" src={maps[form.map ?? "ascent"]} />
              }
            >
              {form.map}
            </Button>

            <Menu
              id="simple-menu2"
              anchorEl={anchorEl2}
              keepMounted
              open={Boolean(anchorEl2)}
              onClose={closeTeamSelection}
            >
              {mapPool
                .filter(
                  (map) =>
                    !match?.veto?.map((v: VetoItem) => v.map).includes(map)
                )
                .map((map) => (
                  <ListItem button onClick={selectMap(map)}>
                    <ListItemAvatar>
                      <Avatar variant="rounded" src={maps[map]} />
                    </ListItemAvatar>
                    <ListItemText style={{ textTransform: "capitalize" }}>
                      {map}
                    </ListItemText>
                  </ListItem>
                ))}
            </Menu>
          </div>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginTop: 10, borderStyle: "dashed", borderWidth: 3 }}
            fullWidth
            disabled={
              !Boolean(
                form.team.org_name ||
                  form.team.university_acronym ||
                  form.team.university_name
              )
            }
            onClick={add}
          >
            Add Veto Above
          </Button>
        </SheetBody>
      </Sheet>
    </Dialog>
  );
};

export default ControlMatchPopupVeto;
