import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Grid, Button, Typography, CardActionArea } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import ArchiveIcon from '@material-ui/icons/Archive';
import DescriptionIcon from '@material-ui/icons/Description';
import VideocamIcon from '@material-ui/icons/Videocam';
import GitHubIcon from "@material-ui/icons/GitHub"
import SlideshowIcon from '@material-ui/icons/Slideshow';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Lightbox from "react-image-lightbox";
import {Link} from "react-router-dom";
import "react-image-lightbox/style.css";

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    width: "100%",
    height: 300,
    [theme.breakpoints.down('xs')]: {
      height: 160,
    },

  },
  image: {
    height: "100%",
    width: "100%",
  },
  button: {
    textTransform: "none",
  },
}));

function ProjectCard(props) {
  const theme = useTheme();
  const classes = useStyles();

  const [toggle, setToggle] = useState(false);

  const { image, title, subtitle, description, githubLink, projectPageLink, paperData, archiveDatas, videoLink, slidesLink } = props;
  const [paperLink, paperLinkLabel] = paperData;

  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  function handleClickOpen() {
    setToggle(true);
  }

  function handleClose() {
    setToggle(false);
  }

  return (
    <Grid container direction={mobile ? "column" : "row"} justify="space-between">
      <Grid item xs={mobile ? true : 4}>

        <Card className={classes.card}>

          <CardActionArea style={{ width: '100%', height: '100%' }} onClick={handleClickOpen}>
            <CardMedia
              className={classes.image}
              image={image}
              title="Project Illustration"
            />
          </CardActionArea>
        </Card>

        {toggle && (
          <Lightbox
            mainSrc={image}
            onCloseRequest={handleClose}
          />
        )}

      </Grid>


      <Grid item xs={mobile ? true : 7}>
        <Grid container direction="column" style={{ marginTop: mobile && 20 }}>

          <Grid item>
            <Typography component="h5" variant="h5" gutterBottom>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              <i>{subtitle}</i>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Grid>

          <Grid container direction="row" alignContent="flex-start" justify="flex-start" style={{ marginTop: mobile ? 20 : 30 }}>
            {githubLink !== null && <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
              <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={githubLink}><GitHubIcon className={classes.icon} />
                Github
              </Button>
            </Grid>}

            {projectPageLink !== null &&
              <Grid container direction="row" alignContent="flex-start" justify="flex-start" style={{ marginBottom: mobile ? 10 : 10 }}>
                <Grid item style={{ marginLeft: 10 }}>
                  
                  <Button component={Link} to={projectPageLink} variant="outlined" color="secondary" className={classes.button}><FolderIcon className={classes.icon} />
                    Project Page
                  </Button>
                </Grid>
              </Grid>}

            {paperLink !== null && <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
              <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={paperLink}><DescriptionIcon className={classes.icon} />
                {paperLinkLabel}
              </Button>
            </Grid>}

            {archiveDatas.map(([archiveLink, archiveLinkLabel],) => (
              <>
                {archiveLink !== null && <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={archiveLink}><ArchiveIcon className={classes.icon} />
                    {archiveLinkLabel}
                  </Button>
                </Grid>}
              </>
            ))}

            {videoLink !== null && <Grid item style={{ marginLeft: 10 }}>
              <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={videoLink}><VideocamIcon className={classes.icon} />
                Video
              </Button>
            </Grid>}

            {slidesLink !== null && <Grid item style={{ marginLeft: 10 }}>
              <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={slidesLink}><SlideshowIcon className={classes.icon} />
                Slides
              </Button>
            </Grid>}

          </Grid>

        </Grid>

      </Grid>
    </Grid >
  );

}

ProjectCard.propTypes = {
  githubLink: PropTypes.string,
  projectPageLink: PropTypes.string,
  paperData: [PropTypes.string, PropTypes.string],
  archiveDatas: [[PropTypes.string, PropTypes.string]],
  videoLink: PropTypes.string,
  slidesLink: PropTypes.string
};

ProjectCard.defaultProps = {
  githubLink: null,
  projectPageLink: null,
  paperData: [null, null],
  archiveDatas: [[null, null]],
  videoLink: null,
  slidesLink: null
};

export default ProjectCard;

