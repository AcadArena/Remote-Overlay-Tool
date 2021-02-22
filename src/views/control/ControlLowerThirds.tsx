import React from "react";

import { useSelector } from "react-redux";

import Sheet from "../../comps/sheet/Sheet";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetFooter from "../../comps/sheet/SheetFooter";
import TextField from "../../comps/textfield/TextField";
import { Typography, Grid, Button } from "@material-ui/core";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import SheetSection from "../../comps/sheet/SheetSection";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { projectFirestore as db } from "../../config/firebase/config";
import PowerOutlinedIcon from "@material-ui/icons/PowerOutlined";
import RadioButton from "../../comps/radiobutton/RadioButton";
import RadioButtonContainer from "../../comps/radiobutton/RadioButtonContainer";
import { LowerThirds, ReduxState } from "../../config/types/types";

const ControlLowerThirds = () => {
  const [form, setForm] = React.useState<LowerThirds>({
    headline: "",
    ticker: "",
    live: false,
  });
  const ws = React.useContext(wsContext);

  const live = useSelector((state: ReduxState) => state.live);
  const { lowerThirds } = live;

  React.useEffect(() => {
    if (!lowerThirds) return;
    if (form === lowerThirds) return;
    setForm(lowerThirds);
  }, [lowerThirds, setForm]);

  const apply = (e: any): void => {
    ws.setLiveSettings({
      lowerThirds: form,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });
  };

  const toggleLowerThirds = (type: "live" | "live_casters") => () => {
    ws.setLiveSettings({ lowerThirds: { ...form, [type]: !form[type] } });
  };

  return (
    <Sheet>
      <SheetHead color="violet">
        <SheetHeadTitle>Lower Thirds</SheetHeadTitle>
        {/* <SheetHeadSub>Subtitle</SheetHeadSub> */}
      </SheetHead>
      <SheetBody>
        {/* Control */}
        <SheetSection>
          <Typography variant="h4">Control</Typography>
          <RadioButtonContainer>
            <RadioButton
              checked={form.live ?? false}
              label="Lower Thirds"
              onClick={toggleLowerThirds("live")}
            />
            <RadioButton
              checked={form.live_casters ?? false}
              label="Casters"
              onClick={toggleLowerThirds("live_casters")}
            />
          </RadioButtonContainer>
        </SheetSection>

        {/* Details */}
        <SheetSection>
          <div className="">
            <Typography variant="h4">Details</Typography>
          </div>
          <Grid container spacing={2}>
            {/* Headline */}
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                label="Headline"
                name="headline"
                value={form.headline}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Ticker */}
            <Grid item xs={12}>
              <TextField
                size="small"
                onChange={handleChange}
                label="Ticker"
                name="ticker"
                multiline
                value={form.ticker}
                rows={1}
                rowsMax={5}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            style={{ marginTop: 10 }}
            disabled={
              form.headline === lowerThirds?.headline &&
              form.ticker === lowerThirds.ticker
            }
            onClick={apply}
            color="primary"
          >
            Apply Changes
          </Button>
        </SheetSection>
      </SheetBody>
      <SheetFooter>
        <PowerOutlinedIcon />
        Websocket only. Not Saved Online.
      </SheetFooter>
    </Sheet>
  );
};

export default ControlLowerThirds;
