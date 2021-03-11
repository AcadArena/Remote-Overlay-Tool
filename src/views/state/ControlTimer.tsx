import { Button, makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import { ReduxState } from "../../config/types/types";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";

import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const makeComponentStyles = makeStyles((theme) => ({
  timer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      margin: 10,
    },
  },
}));

const ControlTimer = () => {
  const classes = makeComponentStyles();
  const ws = React.useContext(wsContext);

  const { room, countdown_minutes } = useSelector(
    (state: ReduxState) => state.live
  );

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const timeCommand = (command: string) => () => {
    ws.socket.emit("time_command", { command, room });
  };

  React.useEffect(() => {
    if (!countdown_minutes) return;

    setSelectedDate(new Date(countdown_minutes));
  }, [countdown_minutes]);

  const setCoundownMinutes = () => {
    ws.setLiveSettings({ countdown_minutes: selectedDate.getTime() });
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const reset = () => {
    ws.setLiveSettings({ countdown_minutes: new Date() });
  };

  return (
    <Sheet>
      <SheetHead color="green" icon={<QueryBuilderIcon />}>
        <SheetHeadTitle>Timer</SheetHeadTitle>
      </SheetHead>
      <SheetBody className={classes.timer}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Time picker"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
            // InputProps={{ disabled: true }}
          />
        </MuiPickersUtilsProvider>

        <Button
          variant="outlined"
          style={{ marginLeft: 10 }}
          startIcon={<QueryBuilderIcon />}
          onClick={setCoundownMinutes}
        >
          Set
        </Button>
        {/* <Button
          variant="outlined"
          style={{ marginLeft: 10 }}
          onClick={timeCommand("start")}
        >
          Start
        </Button> */}
        <Button
          variant="outlined"
          style={{ marginLeft: 10 }}
          onClick={timeCommand("pause")}
          startIcon={<PauseIcon />}
        >
          Pause
        </Button>
        <Button
          variant="outlined"
          style={{ marginLeft: 10 }}
          onClick={timeCommand("resume")}
          startIcon={<PlayArrowIcon />}
        >
          Resume
        </Button>
        <Button
          variant="contained"
          style={{ marginLeft: 10 }}
          onClick={reset}
          color="secondary"
        >
          RESET
        </Button>
      </SheetBody>
    </Sheet>
  );
};

export default ControlTimer;
