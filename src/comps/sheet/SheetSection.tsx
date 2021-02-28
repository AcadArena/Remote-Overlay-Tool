import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const makeComponentStyles = makeStyles((theme) => ({
  SheetSection: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px 0 rgba(0,0,0, .14)",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const SheetSection: React.FC<any & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const classes = makeComponentStyles();
  return (
    <Paper className={classes.SheetSection + " " + className} {...props}>
      {children}
    </Paper>
  );
};

export default SheetSection;
