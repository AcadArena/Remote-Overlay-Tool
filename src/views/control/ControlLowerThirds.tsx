import React from "react";

import { useSelector } from "react-redux";

import Sheet from "../../comps/sheet/Sheet";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetFooter from "../../comps/sheet/SheetFooter";
import TextField from "../../comps/textfield/TextField";
import { Typography, Grid, Button, makeStyles } from "@material-ui/core";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import SheetSection from "../../comps/sheet/SheetSection";
// import { useDocumentData } from "react-firebase-hooks/firestore";
// import { projectFirestore as db } from "../../config/firebase/config";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import PowerOutlinedIcon from "@material-ui/icons/PowerOutlined";
import RadioButton from "../../comps/radiobutton/RadioButton";
import RadioButtonContainer from "../../comps/radiobutton/RadioButtonContainer";
import {
  LowerThirds,
  LowerThirdsMode,
  ReduxState,
} from "../../config/types/types";

const ms = makeStyles((theme) => ({
  accordionHead: {},

  accordionHeadExpanded: {
    // minHeight: "auto!important",
    // margin: 0 + "!important",
  },
}));

const ControlLowerThirds = () => {
  const classes = ms();
  const [form, setForm] = React.useState<LowerThirds>({
    headline: "",
    ticker: "",
    announcement_headline: "",
    announcement_content: "",
    mode: "ticker",
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

  const toggleLowerThirds = () => {
    ws.setLiveSettings({ lowerThirds: { ...form, live: !form.live } });
  };

  const selectMode = (mode: LowerThirdsMode) => () => {
    ws.setLiveSettings({ lowerThirds: { ...form, mode: mode } });
  };

  return (
    <Sheet style={{ border: "1px solid #8e24aa" }}>
      <SheetHead color="violet">
        <SheetHeadTitle>Lower Thirds</SheetHeadTitle>
        {/* <SheetHeadSub>Subtitle</SheetHeadSub> */}
      </SheetHead>
      <SheetBody>
        {/* Control */}
        {/* <SheetSectio  */}

        {/* Actions */}
        <SheetSection style={{ border: "1px solid rgba(0,0,0,.4)" }}>
          <Typography variant="h4">Mode</Typography>
          <RadioButtonContainer>
            <RadioButton
              checked={form.mode === "ticker"}
              label="Ticker"
              onClick={selectMode("ticker")}
            />
            <RadioButton
              checked={form.mode === "casters"}
              label="Caster"
              onClick={selectMode("casters")}
            />
            <RadioButton
              checked={form.mode === "long"}
              label="Long Headline"
              onClick={selectMode("long")}
            />
          </RadioButtonContainer>
        </SheetSection>

        {/* Ticker */}
        <SheetSection style={{ padding: 0 }}>
          <Accordion style={{ padding: "5px 10px", boxShadow: "none" }}>
            <AccordionSummary
              className={classes.accordionHead}
              classes={{ expanded: classes.accordionHeadExpanded }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h4">Ticker</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
        </SheetSection>

        {/* Announcements */}
        <SheetSection style={{ padding: 0 }}>
          <Accordion style={{ padding: "5px 10px", boxShadow: "none" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h4">Announcement</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Headline */}
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    label="Headline"
                    name="announcement_headline"
                    value={form.announcement_headline}
                    fullWidth
                    size="small"
                  />
                </Grid>

                {/* Ticker */}
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    onChange={handleChange}
                    label="Content"
                    name="announcement_content"
                    multiline
                    value={form.announcement_content}
                    rows={1}
                    rowsMax={5}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </SheetSection>

        {/* Player */}
        <SheetSection style={{ padding: 0 }}>
          <Accordion style={{ padding: "5px 10px", boxShadow: "none" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h4">Featured Player</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Headline */}
                <Grid item xs={12}></Grid>

                {/* Ticker */}
                <Grid item xs={12}></Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </SheetSection>

        <Button
          fullWidth
          variant="contained"
          style={{ marginTop: 10 }}
          disabled={
            form.headline === lowerThirds?.headline &&
            form.ticker === lowerThirds?.ticker &&
            form.announcement_headline === lowerThirds?.announcement_headline &&
            form.announcement_content === lowerThirds?.announcement_content
          }
          onClick={apply}
          color="primary"
        >
          Apply Changes
        </Button>
      </SheetBody>

      <SheetFooter>
        <PowerOutlinedIcon />
        Websocket only. Not Saved Online.
      </SheetFooter>
    </Sheet>
  );
};

export default ControlLowerThirds;
