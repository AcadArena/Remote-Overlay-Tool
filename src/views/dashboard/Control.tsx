import React from "react";
import Sheet from "../../comps/sheet/Sheet";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import AccessAlarmsIcon from "@material-ui/icons/AccessAlarms";
import { Grid } from "@material-ui/core";

const Control = () => {
  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Sheet>
            <SheetHead icon={<AccessAlarmsIcon />}>
              <SheetHeadTitle>Test</SheetHeadTitle>
              <SheetHeadSub>Subtitle</SheetHeadSub>
            </SheetHead>
            <div className="">test</div>
          </Sheet>
        </Grid>
      </Grid>
    </div>
  );
};

export default Control;
