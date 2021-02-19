import React from "react";

import {
  makeStyles,
  Button,
  Dialog,
  ButtonBase,
  IconButton,
  Fab,
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
import SheetFooter from "../../comps/sheet/SheetFooter";
import TextField from "../../comps/textfield/TextField";
import AddIcon from "@material-ui/icons/Add";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";

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
}));

const Casters: React.FC = () => {
  const [form, setForm] = React.useState<CastersProps>({ list: [] });
  const [addState, setAddState] = React.useState<boolean>(false);
  const [casters, loader] = useDocumentData<CastersProps>(
    db.collection("live").doc("casters")
  );

  React.useEffect(() => {
    if (!casters) return;
    setForm(casters);
  }, [casters, setForm]);

  const classes = makeComponentStyles();

  return (
    <Sheet>
      <SheetHead color="green">
        <SheetHeadTitle>Casters</SheetHeadTitle>
      </SheetHead>
      <SheetBody>
        <div className={classes.casters}>
          {casters?.list.map((caster) => (
            <div>{caster.name}</div>
          ))}
        </div>

        <Button
          color="primary"
          variant="outlined"
          onClick={() => setAddState(true)}
        >
          Add
        </Button>
      </SheetBody>
      <SheetFooter></SheetFooter>
      <AddDialog open={addState} onClose={() => setAddState(false)}></AddDialog>
    </Sheet>
  );
};

export default Casters;

interface AddDialog {
  open: boolean;
  onClose: () => void;
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
}));

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg",
  "image/svg+xml",
];

const AddDialog: React.FC<AddDialog> = ({ open, onClose }) => {
  const classes = makeDialogStyles();
  const [loader, setLoader] = React.useState<{
    photo: boolean;
    photo_upload_progress: number;
  }>({
    photo: false,
    photo_upload_progress: 0,
  });

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
    db.collection("live")
      .doc("casters")
      .update({
        list: fbase.firestore.FieldValue.arrayUnion(form),
      })
      .then(() => {
        onClose();
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <Sheet>
        <SheetHead icon={<AddIcon fontSize="large" />}>
          <div className={classes.headWrapper}>
            <SheetHeadTitle>Add Caster</SheetHeadTitle>
            <Fab color="primary" onClick={save}>
              <SaveOutlinedIcon fontSize="large"></SaveOutlinedIcon>
            </Fab>
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
                label="Name"
              />
              <TextField fullWidth label="IGN" disabled={loader.photo} />
            </div>
          </div>
        </SheetBody>
      </Sheet>
    </Dialog>
  );
};
