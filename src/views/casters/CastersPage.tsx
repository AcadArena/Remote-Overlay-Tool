import React from "react";
import { Grid } from "@material-ui/core";
import Casters from "./Casters";
import ControlCasterSelection from "./ControlCasterSelection";

const Settings = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} xl={4}>
          <Casters />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <ControlCasterSelection />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <ControlCasterSelection alt />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
