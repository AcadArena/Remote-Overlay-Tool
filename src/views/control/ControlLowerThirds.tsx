import React from "react";

import { useSelector } from "react-redux";

import Sheet from "../../comps/sheet/Sheet";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import AccessAlarmsIcon from "@material-ui/icons/AccessAlarms";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetFooter from "../../comps/sheet/SheetFooter";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import TextField from "../../comps/textfield/TextField";
import { Typography, Grid, Button } from "@material-ui/core";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import SheetSection from "../../comps/sheet/SheetSection";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { projectFirestore as db } from "../../config/firebase/config";

interface LowerThirdsProp {
  headline: string;
  ticker: string;
  live: boolean;
}

const ControlLowerThirds = () => {
  const [form, setForm] = React.useState<LowerThirdsProp>({
    headline: "",
    ticker: "",
    live: false,
  });
  const ws = React.useContext(wsContext);
  const [data] = useDocumentData(db.collection("live").doc("casters"));

  const { lowerThirds } = useSelector((state: any) => state.live);

  React.useEffect(() => {
    if (!lowerThirds) return;
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

  return (
    <Sheet>
      <SheetHead color="violet">
        <SheetHeadTitle>Lower Thirds</SheetHeadTitle>
        {/* <SheetHeadSub>Subtitle</SheetHeadSub> */}
      </SheetHead>
      <SheetBody>
        {/* Long Bar */}
        <SheetSection>
          <div className="">
            <Typography variant="h4">Long Bar</Typography>
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
            onClick={apply}
            color="primary"
          >
            Apply Changes
          </Button>
        </SheetSection>

        {/* Talents */}
        <SheetSection></SheetSection>
      </SheetBody>
      <SheetFooter>footer</SheetFooter>
    </Sheet>
  );
};

export default ControlLowerThirds;
