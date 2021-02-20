import { makeStyles, Paper } from "@material-ui/core";
import React from "react";

const makeComponentStyles = makeStyles((theme) => ({
  SheetSection: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px 0 rgba(0,0,0, .14)",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const SheetSection: React.FC = ({ children, ...props }) => {
  const classes = makeComponentStyles();
  return (
    <Paper className={classes.SheetSection} {...props}>
      {children}
    </Paper>
  );
};

export default SheetSection;
