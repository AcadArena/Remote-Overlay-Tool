import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import SheetHead from "./SheetHead";

interface Sheet {
  icon?: React.ReactElement;
}

const makeComponentStyles = makeStyles((theme) => ({
  sheet: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px 0 rgba(0,0,0, .14)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
}));

const Sheet: React.FC<Sheet> = ({ children, ...props }) => {
  const classes = makeComponentStyles();

  return (
    <Paper className={classes.sheet} {...props}>
      {children}
    </Paper>
  );
};
export default Sheet;
