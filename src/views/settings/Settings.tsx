import React from "react";
import { Grid } from "@material-ui/core";
import Casters from "./Casters";

const Settings = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Casters />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
