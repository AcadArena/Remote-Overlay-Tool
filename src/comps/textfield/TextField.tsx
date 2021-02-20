import React from "react";

import { TextField as TF, makeStyles } from "@material-ui/core";
import { TextFieldProps } from "material-ui";

interface TextField extends TextFieldProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactElement | string;
  [key: string]: any;
}

const makeComponentStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2),
  },
}));

const TextField: React.FC<TextField> = ({ onChange, label, ...props }) => {
  const classes = makeComponentStyles();
  return (
    <TF
      label={label}
      onChange={onChange}
      variant="outlined"
      className={classes.textField}
      {...props}
    />
  );
};

export default TextField;
