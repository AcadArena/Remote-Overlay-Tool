import { ButtonBase, Dialog, makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { wsContext } from "../../config/websocket/WebsocketProvider";

interface WebsocketDialogProps {
  open: boolean;
}

const ms = makeStyles((theme) => ({
  dialog: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(4, 2),
  },
  button: {
    height: 200,
    width: 200,
    border: "1px solid rgba(0,0,0,.25)",
    borderRadius: 3,
    margin: theme.spacing(2),
  },
  buttonContainer: {
    display: "flex",
  },
}));

const WebsocketDialog: React.FC<WebsocketDialogProps> = ({ open }) => {
  const classes = ms();
  const [user, setUser] = React.useState<string>("Controller");
  const ws = React.useContext(wsContext);

  return (
    <Dialog open={open}>
      <div className={classes.dialog}>
        <TextField
          value={user}
          label="HU AR U"
          variant="outlined"
          onChange={({ currentTarget: { value } }) => setUser(value)}
        />
        <div className={classes.buttonContainer}>
          <ButtonBase
            className={classes.button}
            onClick={() => ws.joinRoom("uac", user)}
          >
            UAC
          </ButtonBase>
          <ButtonBase
            className={classes.button}
            onClick={() => ws.joinRoom("nco", user)}
          >
            NCO
          </ButtonBase>
        </div>
      </div>
    </Dialog>
  );
};

export default WebsocketDialog;
