import React from "react";
import { Grid } from "@material-ui/core";
import ControlLowerThirds from "./ControlLowerThirds";
import CasterSelection from "./CasterSelection";

const Control = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <ControlLowerThirds />
        </Grid>
        <Grid item xs={12} md={4}>
          <CasterSelection />
        </Grid>
      </Grid>
    </div>
  );
};

export default Control;
