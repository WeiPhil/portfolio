import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import "react-image-lightbox/style.css";

import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/HomeRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  homebutton: {
    marginRight: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(2),
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
              style={{ marginLeft: 10, marginRight: 30 }}
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
