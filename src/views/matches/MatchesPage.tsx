import React from "react";

import { Grid } from "@material-ui/core";
import MatchesSelection from "./MatchesSelection";

const MatchesPage = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item sm={12} md={6}>
          <MatchesSelection />
        </Grid>
      </Grid>
    </div>
  );
};

export default MatchesPage;
