import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const makeCompoStyles = makeStyles((theme) => ({
  control: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
  },
}));

const RadioButtonContainer: React.FC<{ [key: string]: any }> = ({
  children,
  ...props
}) => {
  const classes = makeCompoStyles();
  return (
    <div className={clsx([classes.control, props.className])}>{children}</div>
  );
};

export default RadioButtonContainer;
