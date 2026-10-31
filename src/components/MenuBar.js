import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger,
  Slide,
  IconButton,
  Box,
  Container,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeRounded';
import SchoolIcon from '@mui/icons-material/School';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link as RouterLink } from 'react-router-dom';
import { profileData } from '../data/portfolioData';

function HideOnScroll({ children, window }) {
  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function MenuBar(props) {
  return (
    <div>
      <HideOnScroll {...props}>
        <AppBar>
          <Container maxWidth="lg" disableGutters>
            <Toolbar sx={{ px: { xs: 1.5, sm: 3 } }}>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/"
                sx={{ mr: 2 }}
                aria-label="Home"
              >
                <HomeIcon />
              </IconButton>

              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  flexGrow: 1,
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                {profileData.name}
              </Typography>

              <Tooltip title="GitHub">
                <IconButton
                  color="inherit"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={profileData.socials.github}
                  aria-label="GitHub"
                  sx={{ mx: 0.25 }}
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Google Scholar">
                <IconButton
                  color="inherit"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={profileData.socials.scholar}
                  aria-label="Google Scholar"
                  sx={{ mx: 0.25 }}
                >
                  <SchoolIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="LinkedIn">
                <IconButton
                  color="inherit"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={profileData.socials.linkedin}
                  aria-label="LinkedIn"
                  sx={{ mx: 0.25 }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="X / Twitter">
                <IconButton
                  color="inherit"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={profileData.socials.twitter}
                  aria-label="Twitter"
                  sx={{ mx: 0.25 }}
                >
                  <TwitterIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
    </div>
  );
}

export default MenuBar;
