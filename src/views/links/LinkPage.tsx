import { Button, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const mcs = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
  },
}));

const LinkPage = () => {
  const classes = mcs();

  const goto = (url: string) => () => {
    window.open(url, "_blank");
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6} lg={4} xl={3}>
        <Sheet>
          <SheetHead>
            <SheetHeadTitle>UAC</SheetHeadTitle>
          </SheetHead>
          <SheetBody>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/castercam")}
              >
                CasterCam
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/castercam?alt=1")}
              >
                CasterCam Alternate
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/timer")}
              >
                Timer
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/content")}
              >
                Modular Banner
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/winner1")}
              >
                Team 1 Winner
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/winner2")}
              >
                Team 2 Winner
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/drafting")}
              >
                Draft
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/ingame")}
              >
                Ingame
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-uac.web.app/vs")}
              >
                VS Screen
              </Button>
            </div>
          </SheetBody>
        </Sheet>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={3}>
        <Sheet>
          <SheetHead>
            <SheetHeadTitle>NCO</SheetHeadTitle>
          </SheetHead>
          <SheetBody>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/castercam")}
              >
                CasterCam
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/timer")}
              >
                Timer
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/ticker")}
              >
                Ticker Only
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/content")}
              >
                Modular Banner
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/winner")}
              >
                Winner
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/drafting")}
              >
                Draft
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/ingame")}
              >
                Ingame
              </Button>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                color="primary"
                className={classes.button}
                onClick={goto("https://aa-nco.web.app/vs")}
              >
                VS Screen
              </Button>
            </div>
          </SheetBody>
        </Sheet>
      </Grid>
    </Grid>
  );
};

export default LinkPage;
