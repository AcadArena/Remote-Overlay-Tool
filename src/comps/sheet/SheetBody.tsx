import { makeStyles } from "@material-ui/core";
import React from "react";

const makeComponentStyles = makeStyles((theme) => ({
  sheetBody: {
    margin: theme.spacing(3),
  },
}));

const SheetBody: React.FC = ({ children }) => {
  const classes = makeComponentStyles();
  return <div className={classes.sheetBody}>{children}</div>;
};

export default SheetBody;