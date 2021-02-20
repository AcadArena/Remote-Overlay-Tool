import { IconButton, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { MouseEvent } from "react";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import clsx from "clsx";
import createTypography from "@material-ui/core/styles/createTypography";

interface RadioButtonProps {
  label?: string;
  checked: boolean;
  fullWidth?: boolean;
  className?: any;
  style?: any;
  onClick?: (e: MouseEvent) => any;
  [key: string]: any;
}

const makeCompStyles = makeStyles((theme) => ({
  radioButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    width: (props: { fullWidth?: boolean }) => (props.fullWidth ? "100%" : ""),
  },
  icon: {
    fontSize: 50,
  },
  label: {
    paddingTop: theme.spacing(1),
  },
}));

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  checked,
  fullWidth,
  onClick,
  ...props
}) => {
  const classes = makeCompStyles({ fullWidth });
  return (
    <Paper
      variant="outlined"
      className={clsx(classes.radioButton, props.className)}
      style={{ ...props.style }}
    >
      <IconButton size="medium" onClick={onClick}>
        {checked ? (
          <RadioButtonCheckedIcon className={classes.icon} />
        ) : (
          <RadioButtonUncheckedIcon className={classes.icon} />
        )}
      </IconButton>
      <Typography align="center" className={classes.label}>
        {label}
      </Typography>
    </Paper>
  );
};

export default RadioButton;
