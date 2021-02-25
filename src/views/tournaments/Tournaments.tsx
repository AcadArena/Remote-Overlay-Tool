import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import RadioButtonContainer from "../../comps/radiobutton/RadioButtonContainer";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import { projectFirestore as db } from "../../config/firebase/config";
import { Participant, ReduxState, Tournament } from "../../config/types/types";
import axios from "axios";
import swal from "sweetalert";

import {
  Button,
  Dialog,
  Grid,
  makeStyles,
  Typography,
  Fab,
  CircularProgress,
  TextField,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { green } from "@material-ui/core/colors";
import RadioButton from "../../comps/radiobutton/RadioButton";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import SheetFooter from "../../comps/sheet/SheetFooter";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const makeCompStyles = makeStyles((theme) => ({
  tournamentsContainer: {},
  sheetBody: {
    display: "flex",
    flexDirection: "column",
  },
  deleteBtn: {
    fontSize: 12,
    margin: theme.spacing(1),
  },
}));

const Tournaments = () => {
  const classes = makeCompStyles();
  const [selected, setSelected] = React.useState<Tournament | undefined>();
  const { tournament } = useSelector((state: ReduxState) => state.live);
  const [tournamentsFS, loading] = useCollectionData<Tournament>(
    db.collection("tournaments"),
    { idField: "uid" }
  );
  const ws = React.useContext(wsContext);
  const [addDialogState, setAddDialogState] = React.useState<boolean>(false);

  // React.useEffect(() => {
  //   if (tournament) {
  //     setSelected(tournament);
  //   } else if (localStorage.getItem("tournament")) {
  //     setSelected(JSON.parse(localStorage.getItem("tournament") ?? ""));
  //   }
  //   return () => {};
  // }, []);

  React.useEffect(() => {
    if (tournament) setSelected(tournament);
  }, [tournament]);

  const selectTournament = (t: Tournament) => () => {
    ws.setLiveSettings({ tournament: t });
  };

  const deleteTournament = (t: Tournament) => () => {
    swal({
      title: "Are you sure?",
      text: `Delete Tournament: ${t.url}`,
      dangerMode: true,
      icon: "warning",
      buttons: ["Ples dont", true],
    }).then((value) => {
      if (value) {
        if (t === tournament) {
          ws.setLiveSettings({ tournament: undefined });
        }
        db.collection("tournaments")
          .doc(t.uid)
          .delete()
          .then(() => {
            swal({
              title: "Successfully deleted tournament!",
              icon: "success",
            });
          });
      }
    });
  };

  return (
    <div style={{ height: "100%" }}>
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{ height: "100%" }}
      >
        <Grid item md={10} xs={12} lg={8}>
          <Sheet loading={loading}>
            <SheetHead>
              <SheetHeadTitle>Tournaments</SheetHeadTitle>
            </SheetHead>
            <SheetBody className={classes.sheetBody}>
              <SheetSection>
                <Typography variant="h4">Select Tournament</Typography>
                <div className={classes.tournamentsContainer}>
                  {!loading &&
                    (tournamentsFS?.length ? (
                      <RadioButtonContainer>
                        {tournamentsFS.map((t) => (
                          <RadioButton
                            key={t.id}
                            checked={t.id === selected?.id}
                            label={t.url}
                            onClick={selectTournament(t)}
                          >
                            <div>Participants: {t.participants.length}</div>
                            <IconButton onClick={deleteTournament(t)}>
                              <DeleteForeverIcon />
                            </IconButton>
                          </RadioButton>
                        ))}
                      </RadioButtonContainer>
                    ) : (
                      "No Tournament Found"
                    ))}
                  {}
                </div>
              </SheetSection>
              <Button
                variant="contained"
                color="primary"
                style={{ alignSelf: "center" }}
                onClick={() => setAddDialogState(true)}
              >
                Add Tournament
              </Button>
            </SheetBody>
            <SheetFooter>
              Data is saved. Selected tournament is websocket only
            </SheetFooter>
          </Sheet>
        </Grid>
      </Grid>

      <AddTournament
        open={addDialogState}
        onClose={(): void => setAddDialogState(false)}
      />
    </div>
  );
};

export default Tournaments;

interface AddTournament {
  open: boolean;
  onClose: () => void;
}

const addTournamentStyles = makeStyles((theme) => ({
  dialogPaper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "visible",
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

  challongeSection: {
    display: "flex",
    alignItems: "center",
    "& .input": {
      flex: 1,
    },

    "& .btn": {
      marginLeft: theme.spacing(2),
    },
  },
}));

const AddTournament: React.FC<AddTournament> = ({ open, onClose }) => {
  const classes = addTournamentStyles();
  const [challongeIdInput, setChallongeIdInput] = React.useState<string>("");
  const [form, setForm] = React.useState<Tournament>({
    id: 0,
    name: "",
    url: "",
    tournament_type: "",
    started_at: "",
    completed_at: "",
    created_at: "",
    updated_at: "",
    state: "",
    ranked_by: "",
    group_stages_enabled: false,
    teams: false,
    participants: [],
    matches: [],
    subdomain: null,
    participants_count: 0,
  });

  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const load = () => {
    const apiKey = "J4V1S6QqJQS6FFcHUKoq6zI3P1r0sddPxB7zcCbC";
    const username = "manoku";
    setLoading(true);
    axios
      .get(
        `https://api.challonge.com/v1/tournaments/${challongeIdInput}.json?api_key=${apiKey}&include_participants=1&include_matches=1`
      )
      .then(({ data: { tournament } }) => {
        setLoading(false);
        setForm({
          id: tournament.id,
          name: tournament.name,
          tournament_type: tournament.tournament_type,
          started_at: tournament.started_at,
          completed_at: tournament.completed_at,
          created_at: tournament.created_at,
          updated_at: tournament.updated_at,
          state: tournament.state,
          ranked_by: tournament.ranked_by,
          group_stages_enabled: tournament.group_stages_enabled,
          teams: tournament.teams,
          participants_count: tournament.participants_count,
          participants: tournament.participants.map(
            ({ participant }: any): Participant => ({
              id: participant.id,
              tournament_id: participant.tournament_id,
              name: participant.name,
              seed: participant.seed,
              active: participant.active,
              created_at: participant.created_at,
              updated_at: participant.updated_at,
              final_rank: participant.final_rank,
              on_waiting_list: participant.on_waiting_list,
              display_name_with_invitation_email_address:
                participant.display_name_with_invitation_email_address,
              display_name: participant.display_name,
              group_player_ids: participant.group_player_ids,
            })
          ),
          matches: [],
          subdomain: tournament.subdomain,
          url: tournament.url,
        });
      })
      .catch((err) => {
        setLoading(false);
        swal({
          title: "Something Went Wrong",
          text: err.message,
          icon: "error",
        });
      });
  };

  const clearAll = () => {
    setForm({
      id: 0,
      name: "",
      url: "",
      tournament_type: "",
      started_at: "",
      completed_at: "",
      created_at: "",
      updated_at: "",
      state: "",
      ranked_by: "",
      group_stages_enabled: false,
      teams: false,
      participants: [],
      matches: [],
      participants_count: 0,
      subdomain: null,
    });
    setLoading(false);
    setSaveLoading(false);
    onClose();
  };

  const save = () => {
    setSaveLoading(true);
    db.collection("tournaments")
      .doc(form.url)
      .set(form)
      .then(() => {
        clearAll();
      })
      .catch((err) => {
        setSaveLoading(false);
        swal({
          title: "Something went wrong!",
          text: err.response.message,
          icon: "error",
        });
      });
  };

  return (
    <Dialog
      open={open}
      onClose={clearAll}
      classes={{ paper: classes.dialogPaper }}
      maxWidth="xs"
      fullWidth
    >
      <Sheet loading={loading}>
        <SheetHead icon={<AddIcon fontSize="large" />}>
          <div className={classes.headWrapper}>
            <SheetHeadTitle>Add Caster</SheetHeadTitle>
            <div className={classes.fabWrapper}>
              <Fab color="primary" onClick={save} disabled={!Boolean(form.id)}>
                {success ? (
                  <CheckIcon fontSize="large" />
                ) : (
                  <SaveOutlinedIcon fontSize="large" />
                )}
              </Fab>
              {saveLoading && (
                <CircularProgress size={68} className={classes.fabProgress} />
              )}
            </div>
          </div>
        </SheetHead>
        <SheetBody>
          <SheetSection>
            <Typography variant="h4">Challonge Tournament</Typography>
            <div className={classes.challongeSection}>
              <TextField
                variant="outlined"
                className="input"
                size="small"
                onChange={({
                  currentTarget: { value },
                }: React.ChangeEvent<HTMLInputElement>) =>
                  setChallongeIdInput(value)
                }
              />
              <Button variant="outlined" className="btn" onClick={load}>
                Load
              </Button>
            </div>
          </SheetSection>
          {Boolean(form.id) && (
            <SheetSection
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              {JSON.stringify(form, null, 4)}
            </SheetSection>
          )}
        </SheetBody>
      </Sheet>
    </Dialog>
  );
};
