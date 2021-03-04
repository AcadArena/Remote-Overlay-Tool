import { makeStyles } from "@material-ui/core";
import React from "react";

const makeComponentStyles = makeStyles((theme) => ({
  sheetBody: {
    margin: theme.spacing(3),
    flex: 1,
  },
}));

interface SheetBody {
  className?: any;
  [key: string]: any;
}

const SheetBody: React.FC<SheetBody> = ({ className, children, ...props }) => {
  const classes = makeComponentStyles();
  return (
    <div className={classes.sheetBody + " " + className} {...props}>
      {children}
    </div>
  );
};

export default SheetBody;
