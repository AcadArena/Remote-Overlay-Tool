import React from "react";
import { Grid } from "@material-ui/core";
import ControlLowerThirds from "./ControlLowerThirds";
import ControlMatch from "./ControlMatch";

const Control = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
          <ControlLowerThirds />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
          <ControlMatch />
        </Grid>
        {/* <Grid item xs={12} sm={12} md={6} lg={4}>
          <CasterSelection />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <CasterSelection alt />
        </Grid> */}
        {/* <Grid item xs={12} sm={12} md={6} lg={4}>
          <ControlTimer />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default Control;
