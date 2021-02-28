import React from "react";

import { useSelector } from "react-redux";

import Sheet from "../../comps/sheet/Sheet";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetFooter from "../../comps/sheet/SheetFooter";
import TextField from "../../comps/textfield/TextField";
import {
  Typography,
  Grid,
  Button,
  makeStyles,
  ListSubheader,
  MenuItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Menu,
} from "@material-ui/core";
import {
  WebsocketProps,
  wsContext,
} from "../../config/websocket/WebsocketProvider";
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
  Participant,
  ReduxState,
} from "../../config/types/types";

const ms = makeStyles((theme) => ({
  accordionHead: {},

  accordionHeadExpanded: {
    // minHeight: "auto!important",
    // margin: 0 + "!important",
  },
  select: {
    maxHeight: 300,
    // width: 200,
  },
  listsubheader: {
    backgroundColor: "#9c27b0",
    color: "#fff",
  },
  featuredPlayer: {
    display: "flex",
    flexDirection: "column",

    "& .selected": {
      display: "flex",
      alignItems: "center",
      "& .teamLogo, .playerPhoto": {
        height: 100,
        width: 100,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,.1)",
        backgroundSize: "contain",
        // backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
        marginRight: theme.spacing(2),
      },

      "& .teamLogo": { backgroundPosition: "center" },
      "& .playerPhoto": { backgroundPosition: "bottom center" },
    },
  },
}));

const SelectionItems = (
  participants: Participant[],
  form: LowerThirds,
  ws: WebsocketProps,
  onClose: () => void
) => {
  const classes = ms();
  let list: any[] = [];
  participants
    .filter((team) => Boolean(team?.players?.length))
    .forEach((team) => {
      list = [
        ...list,
        <ListSubheader key={team.id} className={classes.listsubheader}>
          {team.display_name}
        </ListSubheader>,
      ];

      team.players?.forEach((p) => {
        list = [
          ...list,
          <MenuItem
            button
            dense
            key={p.ign}
            onClick={() => {
              ws.setLiveSettings({
                lowerThirds: { ...form, player: { ...p, team } },
              });
              onClose();
            }}
          >
            <ListItemAvatar>
              <Avatar src={p.photo_main} />
            </ListItemAvatar>
            <ListItemText>{p.ign}</ListItemText>
          </MenuItem>,
        ];
      });
    });
  return list;
};

const ControlLowerThirds = () => {
  const classes = ms();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [form, setForm] = React.useState<LowerThirds>({
    headline: "",
    ticker: "",
    announcement_headline: "",
    announcement_content: "",
    mode: "ticker",
    live: false,
    player: undefined,
    player_stats: {
      left: {
        property: "Header 1",
        value: "Stat 1",
      },
      middle: {
        property: "Header 2",
        value: "Stat 2",
      },
      right: {
        property: "Header 3",
        value: "Stat 3",
      },
    },
    player_quote: "",
  });
  const ws = React.useContext(wsContext);

  const live = useSelector((state: ReduxState) => state.live);
  const { lowerThirds, tournament } = live;

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
            <RadioButton
              checked={form.mode === "playerStats"}
              label="Player Stats"
              disabled={!Boolean(form.player)}
              onClick={selectMode("playerStats")}
            />
            <RadioButton
              checked={form.mode === "playerQuote"}
              label="Player Quote"
              disabled={!Boolean(form.player)}
              onClick={selectMode("playerQuote")}
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
                <Grid item xs={12}>
                  <Button
                    onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                    variant="contained"
                    color="primary"
                  >
                    Select Player
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    classes={{ paper: classes.select }}
                  >
                    {SelectionItems(
                      tournament?.participants ?? [],
                      form,
                      ws,
                      () => setAnchorEl(null)
                    ).map((item: any) => item)}
                  </Menu>
                </Grid>

                <Grid item xs={12} className={classes.featuredPlayer}>
                  <div className="selected">
                    <div
                      className="teamLogo"
                      style={{
                        backgroundImage: `url(${form.player?.team?.logo})`,
                      }}
                    ></div>
                    <div
                      className="playerPhoto"
                      style={{
                        backgroundImage: `url(${form.player?.photo_main})`,
                      }}
                    ></div>
                    <div className="text">
                      <Typography className="ign">
                        {form.player?.ign}
                      </Typography>
                      <Typography className="name">
                        {form.player?.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>

                {/* Stats and Quote */}
                <Grid item xs={12} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_quote}
                    name="player_quote"
                    onChange={handleChange}
                    label="Quote"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_stats?.left?.property}
                    name="property"
                    onChange={({ currentTarget: { name, value } }) =>
                      setForm({
                        ...form,
                        player_stats: {
                          ...form.player_stats,
                          left: { ...form.player_stats?.left, [name]: value },
                        },
                      })
                    }
                    label="Heading 1"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_stats?.left?.value}
                    name="value"
                    onChange={({ currentTarget: { name, value } }) =>
                      setForm({
                        ...form,
                        player_stats: {
                          ...form.player_stats,
                          left: { ...form.player_stats?.left, [name]: value },
                        },
                      })
                    }
                    label="Stat 1"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_stats?.middle?.property}
                    name="property"
                    onChange={({ currentTarget: { name, value } }) =>
                      setForm({
                        ...form,
                        player_stats: {
                          ...form.player_stats,
                          middle: {
                            ...form.player_stats?.middle,
                            [name]: value,
                          },
                        },
                      })
                    }
                    label="Heading 1"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_stats?.middle?.value}
                    name="value"
                    onChange={({ currentTarget: { name, value } }) =>
                      setForm({
                        ...form,
                        player_stats: {
                          ...form.player_stats,
                          middle: {
                            ...form.player_stats?.middle,
                            [name]: value,
                          },
                        },
                      })
                    }
                    label="Stat 1"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_stats?.right?.property}
                    name="property"
                    onChange={({ currentTarget: { name, value } }) =>
                      setForm({
                        ...form,
                        player_stats: {
                          ...form.player_stats,
                          right: {
                            ...form.player_stats?.right,
                            [name]: value,
                          },
                        },
                      })
                    }
                    label="Heading 1"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} className={classes.featuredPlayer}>
                  <TextField
                    value={form.player_stats?.right?.value}
                    name="value"
                    onChange={({ currentTarget: { name, value } }) =>
                      setForm({
                        ...form,
                        player_stats: {
                          ...form.player_stats,
                          right: {
                            ...form.player_stats?.right,
                            [name]: value,
                          },
                        },
                      })
                    }
                    label="Stat 1"
                    size="small"
                  />
                </Grid>
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
            form.announcement_content === lowerThirds?.announcement_content &&
            form.player_stats === lowerThirds?.player_stats &&
            form.player_quote === lowerThirds?.player_quote
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
