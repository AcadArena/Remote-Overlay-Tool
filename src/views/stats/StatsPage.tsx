import { Grid } from "@material-ui/core";
import React from "react";
import StatsPlayer from "./StatsPlayer";
import StatsPlayerVsPlayer from "./StatsPlayerVsPlayer";
import StatsTeamVsTeam from "./StatsTeamVsTeam";

const StatsPage = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6} xl={6} style={{ padding: "30px" }}>
          <StatsPlayer />
        </Grid>
        <Grid item xs={12} lg={6} xl={6} style={{ padding: "30px" }}>
          <StatsPlayerVsPlayer />
        </Grid>
        <Grid item xs={12} lg={6} xl={6} style={{ padding: "30px" }}>
          <StatsTeamVsTeam />
        </Grid>
      </Grid>
    </div>
  );
};

export default StatsPage;
