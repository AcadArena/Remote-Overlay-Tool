import React from "react";

import { Grid } from "@material-ui/core";
import ControlTimer from "./ControlTimer";

const TimerPage = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item sm={12} md={12} lg={8}>
          <ControlTimer />
        </Grid>
      </Grid>
    </div>
  );
};

export default TimerPage;
