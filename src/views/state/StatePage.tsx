import React from "react";

import { Grid } from "@material-ui/core";
import ControlTimer from "./ControlTimer";
import ContainerMode from "./ContainerMode";
import ControlState from "./ControlState";

const StatePage = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item sm={12} md={12} lg={6} style={{ padding: 20 }}>
          <ContainerMode />
        </Grid>
        <Grid item sm={12} md={6} lg={6} xl={3} style={{ padding: 20 }}>
          <ControlTimer />
        </Grid>
        <Grid item sm={12} md={6} lg={6} xl={3} style={{ padding: 20 }}>
          <ControlState />
        </Grid>
      </Grid>
    </div>
  );
};

export default StatePage;
