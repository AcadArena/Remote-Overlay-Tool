import { makeStyles } from "@material-ui/core";
import React from "react";

interface SheetFooter {
  disableBorder?: boolean;
}

const makeComponentStyles = makeStyles((theme) => ({
  SheetFooter: {
    margin: theme.spacing(0, 3, 3, 3),
    paddingTop: theme.spacing(2),
    borderTop: ({ disableBorder }: SheetFooter) =>
      disableBorder ? "none" : "1px solid #eee",
    fontSize: 12,
    color: "#999",
    display: "flex",
    alignItems: "center",

    "& .MuiSvgIcon-root": {
      fontSize: 16,
      margin: theme.spacing(0, 1),
    },
  },
}));

const SheetFooter: React.FC<SheetFooter> = ({ disableBorder, children }) => {
  const classes = makeComponentStyles({ disableBorder });
  return <div className={classes.SheetFooter}>{children}</div>;
};

export default SheetFooter;
