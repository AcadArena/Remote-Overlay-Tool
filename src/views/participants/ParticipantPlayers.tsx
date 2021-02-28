import {
  Button,
  Dialog,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React from "react";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import { Participant, Player, Tournament } from "../../config/types/types";
import GroupIcon from "@material-ui/icons/Group";
import SheetSection from "../../comps/sheet/SheetSection";
import SheetFooter from "../../comps/sheet/SheetFooter";
import AddIcon from "@material-ui/icons/Add";
import WarningIcon from "@material-ui/icons/Warning";
import { DeleteForever } from "@material-ui/icons";
import swal from "sweetalert";
import { projectStorage } from "../../config/firebase/config";

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg",
  "image/svg+xml",
];

interface ParticipantPlayersProps {
  tournament?: Tournament;
  participant?: any;
  setParticipant: React.Dispatch<Participant>;
  open: boolean;
  onClose: () => void;
}

const makeCompStyles = makeStyles((theme) => ({
  dialogPaper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "visible",
  },
  player: {
    display: "flex",
    alignItems: "center",

    "& .texts": {
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(0, 2),
    },

    "& .photo": {
      height: 95,
      width: 95,
      border: "1px solid rgba(0,0,0,.1)",
      backgroundPosition: "bottom center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      fontWeight: 300,
    },
  },
  sheetContainer: {
    padding: theme.spacing(2),
    maxHeight: "70vh",
    overflow: "auto",
  },
}));

const ParticipantPlayers: React.FC<ParticipantPlayersProps> = ({
  participant,
  setParticipant,
  ...props
}) => {
  const classes = makeCompStyles();
  const [loader, setLoader] = React.useState({
    photo_main: false,
    photo_main_upload_progress: 0,
  });

  const addPlayer = () => {
    setParticipant({
      ...participant,
      players: participant?.players
        ? [
            ...participant?.players,
            {
              name: `Player ${participant?.players?.length + 1}`,
              ign: `player${participant?.players?.length + 1}`,
              photo_main: "",
              photo_sub: "",
              photo_profile_shot: "",
              role: "",
            },
          ]
        : [
            {
              name: `Player ${participant?.players?.length ?? 1}`,
              ign: `player${participant?.players?.length ?? 1}`,
              photo_main: "",
              photo_sub: "",
              photo_profile_shot: "",
              role: "",
            },
          ],
    });
  };

  const deletePlayer = (player: Player, index: number) => () => {
    swal({
      title: `Delete Player: ${player.ign}`,
      text: "This process is irreversible",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", true],
    }).then((v) => {
      if (v) {
        setParticipant({
          ...participant,
          players: participant.players.filter(
            (p: Player, i: number) => p !== player && i !== index
          ),
        });
      }
    });
  };

  const handleChange = (player: Player, index: number) => ({
    currentTarget: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({
      ...participant,
      players: participant.players.map((p: Player, i: number) =>
        p === player && i === index ? { ...p, [name]: value } : p
      ),
    });
  };

  const fileSelect = (
    destination: string = "Players/Main/",
    player: Player,
    index: number
  ) => ({ target: { files, name } }: React.ChangeEvent<HTMLInputElement>) => {
    const image = files?.length ? files[0] : null;
    if (image) {
      uploadFile({ file: image, destination, name, player, index });
    }
  };

  const uploadFile = ({
    file,
    destination,
    name,
    player,
    index,
  }: {
    file: File;
    destination: string;
    name: string;
    player: Player;
    index: number;
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
        setParticipant({
          ...participant,
          players: participant.players.map((p: Player, i: number) =>
            p === player && i === index ? { ...p, [name]: url } : p
          ),
        });
      }
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      classes={{ paper: classes.dialogPaper }}
      maxWidth="sm"
    >
      <Sheet loading={loader.photo_main}>
        <SheetHead icon={<GroupIcon />}>
          <SheetHeadTitle>Players</SheetHeadTitle>
        </SheetHead>
        <SheetBody style={{ display: "flex", flexDirection: "column" }}>
          <div className={classes.sheetContainer}>
            {Boolean(participant?.players?.length) ? (
              participant?.players?.map((player: Player, i: number) => (
                <SheetSection className={classes.player} key={i}>
                  <Button
                    component="label"
                    className="photo"
                    style={{ backgroundImage: `url(${player.photo_main})` }}
                  >
                    <input
                      type="file"
                      hidden
                      name="photo_main"
                      onChange={fileSelect("Players/Main/", player, i)}
                    />
                    {!Boolean(player.photo_main) && "Photo"}
                  </Button>
                  <div className="texts">
                    <TextField
                      variant="outlined"
                      className="field"
                      value={player.name}
                      name="name"
                      label="Name"
                      size="small"
                      style={{ marginBottom: 15 }}
                      onChange={handleChange(player, i)}
                    />
                    <TextField
                      variant="outlined"
                      className="field"
                      value={player.ign}
                      name="ign"
                      label="IGN"
                      size="small"
                      style={{ marginBottom: 15 }}
                      onChange={handleChange(player, i)}
                    />
                    <TextField
                      variant="outlined"
                      className="field"
                      value={player.role}
                      name="role"
                      label="Role"
                      size="small"
                      onChange={handleChange(player, i)}
                    />
                  </div>
                  <IconButton onClick={deletePlayer(player, i)}>
                    <DeleteForever />
                  </IconButton>
                </SheetSection>
              ))
            ) : (
              <div style={{ textAlign: "center" }}>No Players</div>
            )}
          </div>
          <div style={{ alignSelf: "center", marginTop: 5 }}>
            <Button
              color="primary"
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={addPlayer}
            >
              Add Player
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: 10 }}
              onClick={props.onClose}
            >
              Close
            </Button>
          </div>
        </SheetBody>
        <SheetFooter>
          <WarningIcon />
          Remember to save the team
        </SheetFooter>
      </Sheet>
    </Dialog>
  );
};

export default ParticipantPlayers;
