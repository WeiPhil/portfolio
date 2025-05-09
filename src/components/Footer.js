import React from "react";
import { makeStyles } from "@mui/styles";
import { Divider, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  footer: {
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: "center",
  },
}));

function Footer(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Divider />
      <Typography
        className={classes.footer}
        variant="subtitle1"
        color="textSecondary"
        gutterBottom
      >
        © 2025 Philippe Weier
      </Typography>
    </React.Fragment>
  );
}

export default Footer;
