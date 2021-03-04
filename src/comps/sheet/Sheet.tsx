import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import SheetHead from "./SheetHead";
import LinearProgress from "@material-ui/core/LinearProgress";

interface Sheet {
  loading?: boolean;
  className?: string;
  [key: string]: any;
}

const makeComponentStyles = makeStyles((theme) => ({
  sheet: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px 0 rgba(0,0,0, .14)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  loader: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
}));

const Sheet: React.FC<Sheet> = ({ loading, children, className, ...props }) => {
  const classes = makeComponentStyles();

  return (
    <Paper className={classes.sheet + " " + className} {...props}>
      {children}

      {loading && <LinearProgress className={classes.loader} />}
    </Paper>
  );
};
export default Sheet;
