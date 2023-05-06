import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Typography } from "@material-ui/core";

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
        © 2023 Philippe Weier
      </Typography>
    </React.Fragment>
  );
}

export default Footer;
