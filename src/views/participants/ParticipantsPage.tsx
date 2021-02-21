import React from "react";
import { useSelector } from "react-redux";
import { Participant, ReduxState, Tournament } from "../../config/types/types";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  projectFirestore as db,
  projectStorage,
} from "../../config/firebase/config";

import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import SheetFooter from "../../comps/sheet/SheetFooter";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";

import {
  makeStyles,
  Typography,
  Button,
  Dialog,
  Fab,
  CircularProgress,
  ButtonBase,
  TextField,
} from "@material-ui/core";
import CloudOutlinedIcon from "@material-ui/icons/CloudOutlined";
import CheckIcon from "@material-ui/icons/Check";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import EditIcon from "@material-ui/icons/Edit";
import { green } from "@material-ui/core/colors";
import { wsContext } from "../../config/websocket/WebsocketProvider";

const makeCompStyles = makeStyles((theme) => ({
  participants: {
    display: "grid",
    gap: "15px",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  participant: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& .logo": {
      fontWeight: 300,
      height: 70,
      width: 70,
      marginRight: theme.spacing(3),
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    "& .name": {
      fontWeight: 300,
    },
    "& .school": {
      color: "#999",
    },
  },
}));

const ParticipantsPage: React.FC = () => {
  const classes = makeCompStyles();
  const { tournament: tournamentWS } = useSelector(
    (state: ReduxState) => state.live
  );
  const tournamentRef = db.collection("tournaments").doc(tournamentWS?.url);
  const [tournamentFS, loading] = useDocumentData<Tournament>(tournamentRef);
  const [selected, setSelected] = React.useState<Participant | undefined>();
  const [editState, setEditState] = React.useState<boolean>(false);

  const editParticipant = ({
    participant,
  }: {
    participant: Participant;
  }) => () => {
    setSelected(participant);
    setEditState(true);
  };

  return (
    <div>
      <Sheet loading={loading}>
        <SheetHead>
          <SheetHeadTitle>Participants</SheetHeadTitle>
          <SheetHeadSub>
            List of teams / players for this tournament
          </SheetHeadSub>
        </SheetHead>
        <SheetBody>
          <div className={classes.participants}>
            {tournamentFS?.participants.map((p, i) => (
              <SheetSection
                key={p.id}
                className={classes.participant}
                onClick={editParticipant({ participant: p })}
              >
                <div
                  className="logo"
                  style={{
                    backgroundImage: `url(${p.logo})`,
                    border: Boolean(p.logo)
                      ? "none"
                      : "1px solid rgba(0,0,0,.1)",
                  }}
                ></div>
                <div className={classes.details}>
                  <div className="name">{p.org_name || p.display_name}</div>
                  <Typography variant="caption" className="school">
                    {p.university_name}
                  </Typography>
                </div>
              </SheetSection>
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <CloudOutlinedIcon />
          Uses Database
        </SheetFooter>
      </Sheet>
      <EditDialog
        tournament={tournamentFS}
        participant={selected}
        open={editState}
        onClose={() => setEditState(false)}
      />
    </div>
  );
};

export default ParticipantsPage;

const makeDialogStyles = makeStyles((theme) => ({
  dialogPaper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "visible",
  },
  inputWrapper: {
    display: "flex",

    "& text-inputs": {
      display: "flex",
      flexDirection: "column",
      "& .input": {
        marginBottom: theme.spacing(2),
      },
    },

    "& .btn": {
      width: 122,
      height: 122,
      border: "1px solid rgba(0,0,0,.25)",
      borderRadius: 4,
      flexShrink: 0,
      marginRight: theme.spacing(2),
      backgroundSize: "cover",
      backgroundPosition: "center",
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
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg",
  "image/svg+xml",
];

interface EditDialogProps {
  participant?: Participant | { [key: string]: any };
  open: boolean;
  onClose: () => void;
  tournament?: Tournament;
}

const EditDialog: React.FC<EditDialogProps> = ({
  participant,
  open,
  onClose,
  tournament,
}) => {
  const classes = makeDialogStyles();
  const [form, setForm] = React.useState<any>();
  const ws = React.useContext(wsContext);
  const [loader, setLoader] = React.useState<{
    logo: boolean;
    logo_upload_progress: number;
  }>({
    logo: false,
    logo_upload_progress: 0,
  });
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!participant) return;
    setForm(participant);
  }, [participant, setForm]);

  const fileSelect = (destination: string = "Logos/") => ({
    target: { files, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const image = files?.length ? files[0] : null;
    if (image) {
      uploadFile({ file: image, destination, name });
    }
  };

  const uploadFile = ({
    file,
    destination,
    name,
  }: {
    file: File;
    destination: string;
    name: string;
  }) => {
    const storageRef = projectStorage.ref(destination + file.name);

    storageRef.put(file).on(
      "state_change",

      // Upload state change event
      (snapshot) => {
        let percentage = Math.ceil(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setLoader({
          ...loader,
          [name + "_upload_progress"]: percentage,
          [name]: true,
        });
      },

      //  on error event
      (error) => {
        setLoader({
          ...loader,
          [name + "_upload_progress"]: 0,
          [name]: false,
        });
      },

      //  on upload finish
      async () => {
        const url = await storageRef.getDownloadURL();
        setLoader({
          ...loader,
          [name + "_upload_progress"]: 0,
          [name]: false,
        });
        setForm({
          ...form,
          [name]: url,
        });
      }
    );
  };

  const handleChange = ({
    currentTarget: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [name]: value });
    console.log(form?.org_name);
  };

  const save = () => {
    setSaveLoading(true);

    db.collection("tournaments")
      .doc(tournament?.url)
      .set({
        ...tournament,
        participants: tournament?.participants.map((p) =>
          p.id === form?.id ? form : p
        ),
      })
      .then(() => {
        setSuccess(true);
        ws.setLiveSettings({ tournament: tournament });
        clearAll();
      })
      .catch((err) => {});
  };

  const clearAll = () => {
    onClose();
    setSaveLoading(false);
    setSuccess(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <Sheet loading={loader.logo}>
        <SheetHead icon={<EditIcon fontSize="large" />}>
          <div className={classes.headWrapper}>
            <SheetHeadTitle>{participant?.display_name}</SheetHeadTitle>
            <div className={classes.fabWrapper}>
              <Fab
                color="primary"
                onClick={save}
                disabled={
                  !Boolean(form?.logo) ||
                  !Boolean(form?.org_name) ||
                  !Boolean(form?.org_acronym) ||
                  !Boolean(form?.university_name) ||
                  !Boolean(form?.university_acronym)
                }
              >
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
          <div className={classes.inputWrapper}>
            <ButtonBase
              className="btn"
              component="label"
              style={{
                backgroundImage: `url(${form?.logo})`,
                border: form?.logo ? "none" : "1px solid rgba(0,0,0,.25)",
              }}
            >
              <input
                type="file"
                hidden
                name="logo"
                accept={fileTypes.join(", ")}
                onChange={fileSelect("Casters/")}
              />
              {!Boolean(form?.logo) && "logo"}
            </ButtonBase>
            <div className="text-inputs">
              <TextField
                style={{ marginTop: 0 }}
                disabled={loader.logo}
                fullWidth
                name="org_name"
                label="Org Name"
                onChange={handleChange}
                variant="outlined"
                value={form?.org_name}
                className={classes.input}
              />
              <TextField
                style={{ marginTop: 0 }}
                disabled={loader.logo}
                fullWidth
                name="org_acronym"
                label="Org Acronym"
                onChange={handleChange}
                variant="outlined"
                value={form?.org_acronym}
                className={classes.input}
              />
              <TextField
                fullWidth
                name="university_name"
                label="University Name"
                disabled={loader.logo}
                onChange={handleChange}
                variant="outlined"
                value={form?.university_name}
                className={classes.input}
              />
              <TextField
                style={{ marginTop: 0 }}
                disabled={loader.logo}
                fullWidth
                name="university_acronym"
                label="University Acronym"
                onChange={handleChange}
                value={form?.university_acronym}
                variant="outlined"
              />
            </div>
          </div>
        </SheetBody>
      </Sheet>
    </Dialog>
  );
};
