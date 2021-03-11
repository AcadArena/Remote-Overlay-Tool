import React from "react";
import { useSelector } from "react-redux";
import RadioButton from "../../comps/radiobutton/RadioButton";
import RadioButtonContainer from "../../comps/radiobutton/RadioButtonContainer";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import { ReduxState } from "../../config/types/types";
import FolderIcon from "@material-ui/icons/Folder";
import { wsContext } from "../../config/websocket/WebsocketProvider";

const ContainerMode = () => {
  const ws = React.useContext(wsContext);
  const { container_mode, room } = useSelector(
    (state: ReduxState) => state.live
  );
  const mode = (mode: string) => () => {
    ws.setLiveSettings({ container_mode: mode });
  };
  return (
    <Sheet>
      <SheetHead icon={<FolderIcon />}>
        <SheetHeadTitle>Container Modes</SheetHeadTitle>
      </SheetHead>
      <SheetBody>
        <RadioButtonContainer>
          <RadioButton
            label="Schedule"
            checked={container_mode === "schedule"}
            onClick={mode("schedule")}
          />
          <RadioButton
            label="Bracket"
            checked={container_mode === "bracket"}
            // disabled
            onClick={mode("bracket")}
          />
          <RadioButton
            label="Standings Group A"
            checked={container_mode === "standings_group_a"}
            onClick={mode("standings_group_a")}
            disabled={room !== "uac"}
          />
          <RadioButton
            label="Standings Group B"
            checked={container_mode === "standings_group_b"}
            onClick={mode("standings_group_b")}
            disabled={room !== "uac"}
          />
          <RadioButton
            label="Team Vs Team"
            checked={container_mode === "stats_team_vs"}
            onClick={mode("stats_team_vs")}
          />
          <RadioButton
            label="Player Stats"
            checked={container_mode === "stats_player"}
            onClick={mode("stats_player")}
          />
          <RadioButton
            label="Player vs Player"
            checked={container_mode === "stats_player_vs"}
            onClick={mode("stats_player_vs")}
          />
          <RadioButton
            label="Schedule ONLY"
            checked={container_mode === "ending"}
            onClick={mode("ending")}
          />
        </RadioButtonContainer>
      </SheetBody>
    </Sheet>
  );
};

export default ContainerMode;
