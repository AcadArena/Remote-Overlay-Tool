import React from "react";
import { Grid } from "@material-ui/core";
import Casters from "./Casters";

const TextFieldsPage = () => {
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <Casters />
        </Grid>
      </Grid>
    </div>
  );
};

export default TextFieldsPage;
