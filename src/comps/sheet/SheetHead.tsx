import classes from "*.module.css";
import { makeStyles } from "@material-ui/core";
import { ToolbarGroup } from "material-ui";
import React from "react";

type Color = "blue" | "green" | "red" | "orange" | "purple";

interface SheetHead {
  behindContent?: React.FC;
  icon?: React.ReactElement;
  color?: Color;
}

const getColor = ({ color }: { color?: Color }): string => {
  switch (color) {
    case "blue":
      return "linear-gradient(60deg,#ab47bc,#8e24aa)";
    case "green":
      return "linear-gradient(60deg,#66bb6a,#43a047)";
    case "red":
      return "linear-gradient(60deg,#66bb6a,#43a047)";
    case "orange":
      return "linear-gradient(60deg,#66bb6a,#43a047)";
    case "purple":
      return "linear-gradient(60deg,#66bb6a,#43a047)";
    default:
      return "linear-gradient(60deg,#ab47bc,#8e24aa)";
  }
};

const makeComponentStyles = makeStyles((theme) => ({
  sheetHead: {
    margin: theme.spacing(-4, 3, 0, 3),
    background: getColor,
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
      fontSize: 36,
    },
  },

  sheetHeadContent: {
    color: "#fff",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
}));

const SheetHead: React.FC<SheetHead> = ({
  icon,
  children,
  color,
  ...props
}) => {
  const classes = makeComponentStyles({ color });

  return (
    <div className={classes.sheetHead}>
      {icon && <div className={classes.icon}>{icon}</div>}
      <div className={classes.sheetHeadContent}>{children}</div>
    </div>
  );
};

export default SheetHead;
