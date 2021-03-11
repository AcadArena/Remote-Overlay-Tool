import React from "react";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import EditIcon from "@material-ui/icons/Edit";
import { LiveData, ReduxState } from "../../config/types/types";
import TextField from "../../comps/textfield/TextField";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { wsContext } from "../../config/websocket/WebsocketProvider";

const ControlState = () => {
  const [state, setState] = React.useState<LiveData>({
    split_title: "Luzon",
    season: "2",
    stage: "Playoffs",
    ingame: "NCO SEASON 2 Playoffs - TUP vs ADMU",
  });
  const { live_data } = useSelector((state: ReduxState) => state.live);
  const ws = React.useContext(wsContext);

  React.useEffect(() => {
    if (!live_data) return;
    setState(live_data);
  }, [live_data]);

  const handleChange = ({
    currentTarget: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [name]: value });
  };

  const apply = () => {
    ws.setLiveSettings({ live_data: state });
  };

  return (
    <Sheet>
      <SheetHead color="blue" icon={<EditIcon />}>
        <SheetHeadTitle>Tournament State</SheetHeadTitle>
      </SheetHead>
      <SheetBody>
        <TextField
          fullWidth
          label="Split Title"
          name="split_title"
          value={state.split_title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Season"
          name="season"
          value={state.season}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Stage"
          name="stage"
          value={state.stage}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Ingame Text"
          name="ingame"
          value={state.ingame}
          onChange={handleChange}
        />
        <Button
          onClick={apply}
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          Apply
        </Button>
      </SheetBody>
    </Sheet>
  );
};

export default ControlState;
