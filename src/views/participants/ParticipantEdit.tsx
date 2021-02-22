import React from "react";

import { Participant, Tournament } from "../../config/types/types";

import {
  makeStyles,
  Dialog,
  Fab,
  CircularProgress,
  ButtonBase,
  TextField,
  Button,
} from "@material-ui/core";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import {
  projectFirestore as db,
  projectStorage,
} from "../../config/firebase/config";

import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";

import CheckIcon from "@material-ui/icons/Check";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import EditIcon from "@material-ui/icons/Edit";

import { green } from "@material-ui/core/colors";
import ParticipantPlayers from "./ParticipantPlayers";
import GroupIcon from "@material-ui/icons/Group";
import SheetFooter from "../../comps/sheet/SheetFooter";
import swal from "sweetalert";
import WarningIcon from "@material-ui/icons/Warning";

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg",
  "image/svg+xml",
];

const makeDialogStyles = makeStyles((theme) => ({
  dialogPaper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "visible",
  },
  inputWrapper: {
    display: "flex",
    "& .side-buttons": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },

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
      fontWeight: 300,
    },

    "& .btn-players": {
      marginRight: theme.spacing(2),
      fontWeight: 300,
      fontSize: 12,
      lineHeight: "12px",
      textAlign: "left",
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

  const [playersState, setPlayersState] = React.useState<boolean>(false);

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
    setForm(participant);
    setSaveLoading(false);
    setSuccess(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() =>
        swal({
          title: "Close this dialog?",
          text: "All changes will be lost",
          icon: "warning",
          dangerMode: true,
          buttons: ["Run it back!", true],
        }).then((value) => value && clearAll())
      }
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
            <div className="side-buttons">
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

              <Button
                variant="contained"
                color="primary"
                className="btn-players"
                startIcon={<GroupIcon />}
                onClick={() => setPlayersState(true)}
              >
                {form?.players?.length ?? 0} Players
              </Button>
            </div>
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
        <SheetFooter>
          <WarningIcon />
          Remember to click save
        </SheetFooter>
      </Sheet>
      <ParticipantPlayers
        open={playersState}
        onClose={() => setPlayersState(false)}
        participant={form}
        setParticipant={setForm}
        tournament={tournament}
      />
    </Dialog>
  );
};

export default EditDialog;
