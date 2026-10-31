import React, { useState } from 'react';
import { Tabs, Tab, Grid, Link, Divider, Box, Fade } from '@mui/material';
import ProjectCard from './ProjectCard';
import {
  publicationsData,
  personalProjectsData,
  studyProjectsData,
} from '../data/portfolioData';

function renderPublicationSubtitle(pub) {
  return (
    <>
      {pub.authors.map((author, idx) => (
        <React.Fragment key={author.name}>
          {idx > 0 && ', '}
          {author.isMe ? (
            <Box
              component="span"
              fontWeight={600}
              sx={{ display: 'inline-block', color: 'text.primary' }}
            >
              {author.name}
            </Box>
          ) : (
            author.name
          )}
        </React.Fragment>
      ))}
      , {pub.year}
      <Box
        fontWeight={500}
        sx={{
          mt: 0.35,
          color: 'primary.main',
          fontStyle: 'normal',
          fontSize: '0.9rem',
        }}
      >
        {pub.venueLine}
      </Box>
    </>
  );
}

function renderPublicationDescription(pub) {
  const fullText = pub.abstract.join(' ');
  if (pub.abstractLink && fullText.includes(pub.abstractLink.match)) {
    const parts = fullText.split(pub.abstractLink.match);
    return (
      <>
        <Box fontWeight={600} sx={{ mt: '4px', mb: '2px', color: 'text.primary' }}>
          Abstract
        </Box>
        {parts[0]}
        <Link href={pub.abstractLink.url} target="_blank" rel="noopener noreferrer">
          {pub.abstractLink.match}
        </Link>
        {parts[1]}
      </>
    );
  }
  return (
    <>
      <Box fontWeight={600} sx={{ mb: '2px', color: 'text.primary' }}>
        Abstract
      </Box>
      {pub.abstract.map((paragraph, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {paragraph}
        </React.Fragment>
      ))}
    </>
  );
}

function renderProjectRichText(richObj) {
  if (!richObj) return null;
  return (
    <>
      {richObj.prefix}
      <Link href={richObj.linkUrl} target="_blank" rel="noopener noreferrer">
        {richObj.linkText}
      </Link>
      {richObj.suffix}
    </>
  );
}

function renderMultiLinksText(multiObj) {
  if (!multiObj) return null;
  return (
    <>
      {multiObj.part1}
      <Link href={multiObj.link1Url} target="_blank" rel="noopener noreferrer">
        {multiObj.link1Text}
      </Link>
      {multiObj.part2}
      <Link href={multiObj.link2Url} target="_blank" rel="noopener noreferrer">
        {multiObj.link2Text}
      </Link>
      {multiObj.part3}
    </>
  );
}

function ProjectsOverview() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabStyle = {
    textTransform: 'uppercase',
    fontSize: (theme) => theme.typography.pxToRem(15),
    fontWeight: 500,
    color: 'text.secondary',
    py: 1.5,
    '&.Mui-selected': {
      color: 'primary.main',
      fontWeight: 600,
    },
  };

  return (
    <Box
      sx={{
        m: { xs: '16px', md: '40px 48px' },
        height: '100%',
      }}
    >
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ children: <div /> }}
          sx={{
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              height: 3,
              '& > div': {
                maxWidth: 90,
                width: '100%',
                borderRadius: '3px 3px 0 0',
                backgroundColor: 'primary.main',
              },
            },
          }}
        >
          <Tab disableRipple sx={tabStyle} label="Publications" />
          <Tab disableRipple sx={tabStyle} label="Personal Projects" />
          <Tab disableRipple sx={tabStyle} label="Study Projects" />
        </Tabs>
      </Box>

      <Box sx={{ mt: '44px', height: '100%' }}>
        {tabValue === 0 && (
          <Fade in timeout={220}>
            <Grid container direction="column">
              {publicationsData.map((pub, index) => (
                <div key={pub.id}>
                  {index !== 0 && <Divider sx={{ my: '36px' }} />}
                  <Grid item>
                    <ProjectCard
                      image={pub.thumbnail}
                      title={pub.title}
                      subtitle={renderPublicationSubtitle(pub)}
                      description={renderPublicationDescription(pub)}
                      projectPageLink={pub.slug}
                    />
                  </Grid>
                </div>
              ))}
            </Grid>
          </Fade>
        )}

        {tabValue === 1 && (
          <Fade in timeout={220}>
            <Grid container direction="column">
              {personalProjectsData.map((proj, index) => (
                <div key={proj.id}>
                  {index !== 0 && <Divider sx={{ my: '36px' }} />}
                  <Grid item>
                    <ProjectCard
                      image={proj.thumbnail}
                      title={proj.title}
                      subtitle={proj.subtitle || renderProjectRichText(proj.subtitleRich)}
                      description={proj.description || renderProjectRichText(proj.descriptionRich)}
                      githubLink={proj.githubLink}
                      projectPageLink={proj.projectPageLink}
                    />
                  </Grid>
                </div>
              ))}
            </Grid>
          </Fade>
        )}

        {tabValue === 2 && (
          <Fade in timeout={220}>
            <Grid container direction="column">
              {studyProjectsData.map((proj, index) => (
                <div key={proj.id}>
                  {index !== 0 && <Divider sx={{ my: '36px' }} />}
                  <Grid item>
                    <ProjectCard
                      image={proj.thumbnail}
                      title={proj.title}
                      subtitle={proj.subtitle || renderProjectRichText(proj.subtitleRich)}
                      description={
                        proj.description ||
                        renderProjectRichText(proj.descriptionRich) ||
                        renderMultiLinksText(proj.descriptionMultiLinks)
                      }
                      githubLink={proj.githubLink}
                      projectPageLink={proj.projectPageLink}
                    />
                  </Grid>
                </div>
              ))}
            </Grid>
          </Fade>
        )}
      </Box>
    </Box>
  );
}

export default ProjectsOverview;
