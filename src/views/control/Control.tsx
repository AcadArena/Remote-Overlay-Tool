import React from "react";
import { Grid } from "@material-ui/core";
import ControlLowerThirds from "./ControlLowerThirds";

const Control = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <ControlLowerThirds />
        </Grid>
      </Grid>
    </div>
  );
};

export default Control;
