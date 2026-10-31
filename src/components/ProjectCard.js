import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  Grid,
  Button,
  Typography,
  CardActionArea,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Link as RouterLink } from 'react-router-dom';

function ProjectCard({
  image,
  title,
  subtitle,
  description,
  githubLink = null,
  projectPageLink = null,
  paperData = [null, null],
  archiveDatas = [[null, null]],
  linkDatas = [[null, null]],
  videoLink = null,
  presentationData = [null, null],
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [paperLink, paperLinkLabel] = paperData;
  const [presentationLink, presentationLabel] = presentationData;

  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const isInternalLink =
    projectPageLink &&
    !projectPageLink.startsWith('http://') &&
    !projectPageLink.startsWith('https://');

  return (
    <Grid
      container
      direction={mobile ? 'column' : 'row'}
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Grid item xs={mobile ? 12 : 4} sx={{ width: '100%' }}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            height: { xs: 240, sm: 280, md: 285 },
            borderRadius: 1.5,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 14px -2px rgba(15, 23, 42, 0.08)',
            transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            '&:hover': {
              boxShadow: '0 10px 24px -4px rgba(15, 23, 42, 0.14)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardActionArea
            sx={{ width: '100%', height: '100%' }}
            onClick={() => setOpen(true)}
          >
            <CardMedia
              sx={{ height: '100%', width: '100%' }}
              image={image}
              title={title}
            />
          </CardActionArea>
        </Card>

        <Lightbox
          carousel={{ finite: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
          open={open}
          close={() => setOpen(false)}
          slides={[{ src: image }]}
        />
      </Grid>

      <Grid item xs={mobile ? 12 : 7.5} sx={{ width: '100%' }}>
        <Grid container direction="column" sx={{ mt: mobile ? '20px' : 0 }}>
          <Grid item>
            <Typography
              component="h5"
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 0.75 }}
            >
              {projectPageLink ? (
                isInternalLink ? (
                  <Box
                    component={RouterLink}
                    to={projectPageLink}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {title}
                  </Box>
                ) : (
                  <Box
                    component="a"
                    href={projectPageLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {title}
                  </Box>
                )
              ) : (
                title
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              gutterBottom
              sx={{ mb: 1.25, fontSize: '0.96rem', lineHeight: 1.55 }}
            >
              <i>{subtitle}</i>
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{ lineHeight: 1.65 }}
            >
              {description}
            </Typography>
          </Grid>

          <Stack
            direction="row"
            spacing={1.25}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: mobile ? '18px' : '24px' }}
          >
            {projectPageLink !== null &&
              (isInternalLink ? (
                <Button
                  component={RouterLink}
                  to={projectPageLink}
                  variant="outlined"
                  color="secondary"
                  startIcon={<FolderOutlinedIcon fontSize="small" />}
                >
                  Project Page
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  href={projectPageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<FolderOutlinedIcon fontSize="small" />}
                >
                  Project Page
                </Button>
              ))}

            {githubLink !== null && (
              <Button
                variant="outlined"
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
                href={githubLink}
                startIcon={<GitHubIcon fontSize="small" />}
              >
                Github
              </Button>
            )}

            {paperLink !== null && (
              <Button
                variant="outlined"
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
                href={paperLink}
                startIcon={<DescriptionOutlinedIcon fontSize="small" />}
              >
                {paperLinkLabel}
              </Button>
            )}

            {archiveDatas.map(([archiveLink, archiveLabel], idx) =>
              archiveLink !== null ? (
                <Button
                  key={archiveLink || idx}
                  variant="outlined"
                  color="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={archiveLink}
                  startIcon={<ArchiveOutlinedIcon fontSize="small" />}
                >
                  {archiveLabel}
                </Button>
              ) : null
            )}

            {linkDatas.map(([link, linkLabel], idx) =>
              link !== null ? (
                <Button
                  key={link || idx}
                  variant="outlined"
                  color="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link}
                  startIcon={<OpenInNewRoundedIcon fontSize="small" />}
                >
                  {linkLabel}
                </Button>
              ) : null
            )}

            {videoLink !== null && (
              <Button
                variant="outlined"
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
                href={videoLink}
                startIcon={<VideocamOutlinedIcon fontSize="small" />}
              >
                Video
              </Button>
            )}

            {presentationLink !== null && (
              <Button
                variant="outlined"
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
                href={presentationLink}
                startIcon={<SlideshowOutlinedIcon fontSize="small" />}
              >
                {presentationLabel}
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

ProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  githubLink: PropTypes.string,
  projectPageLink: PropTypes.string,
  paperData: PropTypes.arrayOf(PropTypes.string),
  presentationData: PropTypes.arrayOf(PropTypes.string),
  archiveDatas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  linkDatas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  videoLink: PropTypes.string,
};

export default ProjectCard;
