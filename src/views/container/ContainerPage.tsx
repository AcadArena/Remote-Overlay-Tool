import { Grid } from "@material-ui/core";
import React from "react";
import ContainerMode from "./ContainerMode";

const ContainerPage = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6} xl={6} style={{ padding: "30px" }}>
          <ContainerMode />
        </Grid>
      </Grid>
    </div>
  );
};

export default ContainerPage;
