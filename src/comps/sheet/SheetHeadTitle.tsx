import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const makeComponentStyles = makeStyles((theme) => ({
  title: {
    color: "#fff",
    fontWeight: 300,
    fontSize: 18,
  },
}));

const SheetHeadTitle: React.FC<{ className?: string; [key: string]: any }> = ({
  className,
  children,
  ...props
}) => {
  const classes = makeComponentStyles();
  return (
    <Typography
      variant="h5"
      className={classes.title + " " + className}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default SheetHeadTitle;
