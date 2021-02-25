import React, { MouseEvent } from "react";

import {
  makeStyles,
  Button,
  Dialog,
  ButtonBase,
  Fab,
  CircularProgress,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";

import { useDocumentData } from "react-firebase-hooks/firestore";
import fbase, {
  projectFirestore as db,
  projectStorage,
} from "../../config/firebase/config";
import { useSelector } from "react-redux";
import SheetFooter from "../../comps/sheet/SheetFooter";
import TextField from "../../comps/textfield/TextField";

import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloudOutlinedIcon from "@material-ui/icons/CloudOutlined";
import { green } from "@material-ui/core/colors";
import { DeleteForever } from "@material-ui/icons";
import { ReduxState } from "../../config/types/types";
interface Caster {
  name: string;
  ign: string;
  photo: string;
  photo_ref: string;
}
interface CastersProps {
  list: Caster[];
}

const makeComponentStyles = makeStyles((theme) => ({
  castersSheet: {},
  casters: {
    displayt: "flex",
    flexDirection: "column",
  },
  caster: {
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(3),
    border: "1px solid rgba(0,0,0,.1)",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",

    "& .info": {
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(0, 3),
      flex: 1,

      "& .name": {
        fontSize: 12,
      },

      "& .ign": {
        fontWeight: 400,
      },
    },
  },
  noCaster: { padding: theme.spacing(0, 0, 2, 0) },
}));

const Casters: React.FC = () => {
  const [form, setForm] = React.useState<CastersProps>({ list: [] });
  const [addState, setAddState] = React.useState<boolean>(false);
  const { tournament } = useSelector((state: ReduxState) => state.live);
  const tournamentRef = db.collection("tournaments").doc(tournament?.url);
  const [casters, loading, error] = useDocumentData<CastersProps>(
    tournamentRef.collection("live").doc("casters")
  );

  React.useEffect(() => {
    if (!casters) return;
    setForm(casters);
  }, [casters, setForm]);

  const classes = makeComponentStyles();

  const openEditDialog = () => {};

  const deleteCaster = (caster: Caster) => {
    tournamentRef
      .collection("live")
      .doc("casters")
      .update({
        list: fbase.firestore.FieldValue.arrayRemove(caster),
      });
  };

  return (
    <Sheet loading={loading}>
      <SheetHead color="green">
        <SheetHeadTitle>Casters</SheetHeadTitle>
      </SheetHead>
      <SheetBody>
        <div className={classes.casters}>
          {casters?.list.length ? (
            casters?.list.map((caster) => (
              <div key={caster.ign} className={classes.caster}>
                <Avatar src={caster.photo} />
                <div className="info">
                  <div className="ign">{caster.ign}</div>
                  <div className="name">{caster.name}</div>
                </div>
                <MenuButton
                  caster={caster}
                  editCaster={openEditDialog}
                  deleteCaster={deleteCaster}
                />
              </div>
            ))
          ) : (
            <div className={classes.noCaster}>
              No caster Yet for this tournament
            </div>
          )}
        </div>

        <Button
          color="primary"
          variant="outlined"
          onClick={() => setAddState(true)}
        >
          Add
        </Button>
      </SheetBody>
      <SheetFooter>
        <CloudOutlinedIcon /> Saved Online
      </SheetFooter>
      <AddDialog
        open={addState}
        onClose={() => setAddState(false)}
        tournamentRef={tournamentRef}
      ></AddDialog>
    </Sheet>
  );
};

export default Casters;

interface AddDialog {
  open: boolean;
  onClose: () => void;
  tournamentRef: fbase.firestore.DocumentReference;
}

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
    },

    "& .btn": {
      width: 122,
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
}));

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg",
  "image/svg+xml",
];

const AddDialog: React.FC<AddDialog> = ({ open, onClose, tournamentRef }) => {
  const classes = makeDialogStyles();
  const [loader, setLoader] = React.useState<{
    photo: boolean;
    photo_upload_progress: number;
  }>({
    photo: false,
    photo_upload_progress: 0,
  });
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);

  const [form, setForm] = React.useState<Caster>({
    name: "",
    ign: "",
    photo: "",
    photo_ref: "",
  });

  const handleChange = ({
    currentTarget: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [name]: value });
  };

  const fileSelect = (destination: string = "Casters/") => ({
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
          [name + "_ref"]: destination + file.name,
        });
      }
    );
  };

  const save = () => {
    setSaveLoading(true);
    tournamentRef
      .collection("live")
      .doc("casters")
      .set(
        {
          list: fbase.firestore.FieldValue.arrayUnion(form),
        },
        { merge: true }
      )
      .then(() => {
        setSaveLoading(false);
        closeRemarks();
      });
  };

  const closeRemarks = () => {
    setForm({ name: "", ign: "", photo: "", photo_ref: "" });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={closeRemarks}
      maxWidth="xs"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <Sheet loading={loader.photo}>
        <SheetHead icon={<AddIcon fontSize="large" />}>
          <div className={classes.headWrapper}>
            <SheetHeadTitle>Add Caster</SheetHeadTitle>
            <div className={classes.fabWrapper}>
              <Fab
                color="primary"
                onClick={save}
                disabled={!Boolean(form.name) || !Boolean(form.ign)}
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
                backgroundImage: `url(${form.photo})`,
                border: form.photo ? "none" : "1px solid rgba(0,0,0,.25)",
              }}
            >
              <input
                type="file"
                hidden
                name="photo"
                accept={fileTypes.join(", ")}
                onChange={fileSelect("Casters/")}
              />
              {!Boolean(form.photo) && "Photo"}
            </ButtonBase>
            <div className="text-inputs">
              <TextField
                style={{ marginTop: 0 }}
                disabled={loader.photo}
                fullWidth
                name="name"
                label="Name"
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="IGN"
                name="ign"
                disabled={loader.photo}
                onChange={handleChange}
              />
            </div>
          </div>
        </SheetBody>
      </Sheet>
    </Dialog>
  );
};

interface MenuButtonProps {
  editCaster: () => void;
  deleteCaster: (caster: Caster) => void;
  caster: Caster;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  caster,
  editCaster,
  deleteCaster,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <IconButton
        size="small"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        <MenuItem onClick={() => deleteCaster(caster)}>
          <ListItemIcon>
            <DeleteForever />
          </ListItemIcon>
          <ListItemText>Delete {caster.ign}</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
