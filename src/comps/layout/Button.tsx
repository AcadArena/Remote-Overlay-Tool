import React from "react";
import { Button as Btn, makeStyles } from "@material-ui/core";

interface btnProps {
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
  variant?: "rounded" | "square";
  size?: "small" | "medium" | "large";
  [propName: string]: any;
}

const getShadowColor = (color: string | undefined, opacity: number): string => {
  console.log(color);
  switch (color) {
    case "primary":
      return `rgb(156 39 176 / ${opacity}%)`;
    default:
      return `rgb(224 224 224 / ${opacity}%)`;
  }
};

const useStyles = makeStyles((theme) => ({
  btn: {
    boxShadow: "none",
    fontWeight: "normal",

    "&:focus": {
      boxShadow: (props: btnProps) =>
        `0 14px 26px -12px ${getShadowColor(
          props.color,
          42
        )}, 0 4px 23px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px ${getShadowColor(
          props.color,
          20
        )}`,
    },
    "&:hover": {
      boxShadow: (props: btnProps) =>
        `0 14px 26px -12px ${getShadowColor(
          props.color,
          42
        )}, 0 4px 23px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px ${getShadowColor(
          props.color,
          20
        )}`,
    },
  },
}));

const Button: React.FC<btnProps> = ({ children, ...props }) => {
  const classes = useStyles(props);
  return (
    <Btn
      size={props.size || "medium"}
      variant="contained"
      color={props.color}
      className={classes.btn}
    >
      {children}
    </Btn>
  );
};

export default Button;
