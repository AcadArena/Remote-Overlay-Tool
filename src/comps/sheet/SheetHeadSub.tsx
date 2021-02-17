import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const makeComponentStyles = makeStyles((theme) => ({
  title: {
    color: "rgba(255, 255, 255, 0.62)",
    fontWeight: 300,
    fontSize: 14,
  },
}));

const SheetHeadSub: React.FC = ({ children, ...props }) => {
  const classes = makeComponentStyles();
  return (
    <Typography variant="h5" className={classes.title} {...props}>
      {children}
    </Typography>
  );
};

export default SheetHeadSub;
