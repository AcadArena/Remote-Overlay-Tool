import classes from "*.module.css";
import { makeStyles } from "@material-ui/core";
import { ToolbarGroup } from "material-ui";
import React from "react";
import Sheet from "./Sheet";

type Color = "blue" | "green" | "red" | "orange" | "violet";

interface SheetHead {
  behindContent?: React.FC;
  icon?: React.ReactElement;
  color?: Color;
  align?: "right" | "left";
}

const getBackgroundColor = ({ color }: SheetHead): string => {
  switch (color) {
    case "violet":
      return "linear-gradient(60deg,#ab47bc,#8e24aa)";
    case "green":
      return "linear-gradient(60deg,#66bb6a,#43a047)";
    case "red":
      return "linear-gradient(60deg, #ef5350, #e53935)";
    case "orange":
      return "linear-gradient(60deg, #ffa726, #fb8c00)";
    case "blue":
      return "linear-gradient(60deg, #26c6da, #00acc1)";
    default:
      return "linear-gradient(60deg,#ab47bc,#8e24aa)";
  }
};

const getShadowColor = ({ color }: SheetHead): string => {
  switch (color) {
    case "violet":
      return "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(156, 39, 176, .4)";
    case "green":
      return "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(76, 175, 80, .40)";
    case "red":
      return "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(244, 67, 54, .40)";
    case "orange":
      return "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0, .40)";
    case "blue":
      return "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(0, 172, 193, .40)";
    default:
      return "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(156, 39, 176, .4)";
  }
};

const alignHead = ({ align }: SheetHead) => {
  switch (align) {
    case "left":
      return "stretch";
    case "right":
      return "flex-end";
    default:
      return "stretch";
  }
};

const makeComponentStyles = makeStyles((theme) => ({
  sheetHead: {
    margin: theme.spacing(-4, 3, 0, 3),
    background: getBackgroundColor,
    boxShadow: getShadowColor,
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    padding: theme.spacing(6),
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& .MuiSvgIcon-root": {
      color: "#fff",
      // fontSize: 36,
    },
  },

  sheetHeadContent: {
    color: "#fff",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    padding: ({ icon }: SheetHead) =>
      Boolean(icon) ? theme.spacing(0, 6, 0, 0) : theme.spacing(3, 6),
    alignItems: alignHead,
  },
}));

const SheetHead: React.FC<SheetHead> = ({
  icon,
  children,
  color,
  align,
  ...props
}) => {
  const classes = makeComponentStyles({ color, align, icon });

  return (
    <div className={classes.sheetHead}>
      {icon && <div className={classes.icon}>{icon}</div>}
      <div className={classes.sheetHeadContent}>{children}</div>
    </div>
  );
};

export default SheetHead;
