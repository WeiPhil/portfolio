import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import "react-image-lightbox/style.css";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/HomeRounded";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  homebutton: {
    marginRight: theme.spacing(2),
  },
  appbar: {
    backgroundColor: theme.palette.grey[800],
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function MenuBar(props) {
  const classes = useStyles();

  return (
    <div>
      {/* // <React.Fragment> */}
      <HideOnScroll {...props}>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton
              className={classes.homebutton}
              color="inherit"
              href={process.env.PUBLIC_URL + "/"}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Philippe Weier
            </Typography>

            <IconButton
              color="inherit"
              target="_blank"
              href="https://github.com/WeiPhil"
            >
              <GitHubIcon className={classes.icon}></GitHubIcon>
            </IconButton>
            <IconButton
              color="inherit"
              target="_blank"
              href="https://ch.linkedin.com/in/philippe-weier-5125a2165"
            >
              <LinkedInIcon className={classes.icon}></LinkedInIcon>
            </IconButton>
            <IconButton
              color="inherit"
              target="_blank"
              href="https://twitter.com/PhilippeWeier"
            >
              <TwitterIcon className={classes.icon}></TwitterIcon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <div className={classes.offset} />
      {/* // </React.Fragment> */}
    </div>
  );
}

export default MenuBar;
