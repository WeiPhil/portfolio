import React, { useState } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Button, Typography, CardActionArea } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ArchiveIcon from "@mui/icons-material/Archive";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import DescriptionIcon from "@mui/icons-material/Description";
import VideocamIcon from "@mui/icons-material/Videocam";
import GitHubIcon from "@mui/icons-material/GitHub";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import Lightbox from "react-image-lightbox";
import { Link } from "react-router-dom";
import "react-image-lightbox/style.css";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    width: "100%",
    height: 300,
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

  const {
    image,
    title,
    subtitle,
    description,
    githubLink,
    projectPageLink,
    paperData,
    archiveDatas,
    linkDatas,
    videoLink,
    presentationData,
  } = props;
  const [paperLink, paperLinkLabel] = paperData;
  const [presentationLink, presentationLabel] = presentationData;

  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  function handleClickOpen() {
    setToggle(true);
  }

  function handleClose() {
    setToggle(false);
  }

  return (
    <Grid
      container
      direction={mobile ? "column" : "row"}
      justifyContent="space-between"
    >
      <Grid item xs={mobile ? true : 4}>
        <Card className={classes.card}>
          <CardActionArea
            style={{ width: "100%", height: "100%" }}
            onClick={handleClickOpen}
          >
            <CardMedia
              className={classes.image}
              image={image}
              title="Project Illustration"
            />
          </CardActionArea>
        </Card>

        {toggle && <Lightbox mainSrc={image} onCloseRequest={handleClose} />}
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

          <Grid
            container
            direction="row"
            alignContent="flex-start"
            justifyContent="flex-start"
            style={{ marginTop: mobile ? 20 : 30 }}
          >
            {projectPageLink !== null && (
              <Grid
                container
                direction="row"
                alignContent="flex-start"
                justifyContent="flex-start"
                style={{ marginBottom: mobile ? 10 : 10 }}
              >
                <Grid item style={{ marginLeft: 10 }}>
                  {projectPageLink.substring(0, 4) !== "http" ? (
                    <Button
                      component={Link}
                      to={projectPageLink}
                      variant="outlined"
                      color="secondary"
                      className={classes.button}
                    >
                      <FolderIcon className={classes.icon} />
                      Project Page
                    </Button>
                  ) : (
                    // For absolute path links
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.button}
                      href={projectPageLink}
                      target="_blank"
                    >
                      <FolderIcon className={classes.icon} />
                      Project Page
                    </Button>
                  )}
                </Grid>
              </Grid>
            )}

            {githubLink !== null && (
              <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  target="_blank"
                  href={githubLink}
                >
                  <GitHubIcon className={classes.icon} />
                  Github
                </Button>
              </Grid>
            )}

            {paperLink !== null && (
              <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  target="_blank"
                  href={paperLink}
                >
                  <DescriptionIcon className={classes.icon} />
                  {paperLinkLabel}
                </Button>
              </Grid>
            )}

            {archiveDatas.map(([archiveLink, archiveLabel]) => (
              <>
                {archiveLink !== null && (
                  <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.button}
                      target="_blank"
                      href={archiveLink}
                    >
                      <ArchiveIcon className={classes.icon} />
                      {archiveLabel}
                    </Button>
                  </Grid>
                )}
              </>
            ))}

            {linkDatas.map(([link, linkLabel]) => (
              <>
                {link !== null && (
                  <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.button}
                      target="_blank"
                      href={link}
                    >
                      <OpenInBrowserIcon className={classes.icon} />
                      {linkLabel}
                    </Button>
                  </Grid>
                )}
              </>
            ))}

            {videoLink !== null && (
              <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  target="_blank"
                  href={videoLink}
                >
                  <VideocamIcon className={classes.icon} />
                  Video
                </Button>
              </Grid>
            )}

            {presentationLink !== null && (
              <Grid item style={{ marginLeft: 10, marginTop: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  target="_blank"
                  href={presentationLink}
                >
                  <SlideshowIcon className={classes.icon} />
                  {presentationLabel}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

ProjectCard.propTypes = {
  githubLink: PropTypes.string,
  projectPageLink: PropTypes.string,
  paperData: PropTypes.arrayOf(PropTypes.string),
  presentationData: PropTypes.arrayOf(PropTypes.string),
  archiveDatas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  linkDatas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string, PropTypes.string)),
  videoLink: PropTypes.string,
};

ProjectCard.defaultProps = {
  githubLink: null,
  projectPageLink: null,
  paperData: [null, null],
  presentationData: [null, null],
  archiveDatas: [[null, null]],
  linkDatas: [[null, null]],
  videoLink: null,
};

export default ProjectCard;
