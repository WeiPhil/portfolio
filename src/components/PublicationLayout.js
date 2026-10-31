import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import OpenInBrowser from '@mui/icons-material/OpenInBrowser';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import ACMIcon from './ACMIcon';
import AuthorBanner from './AuthorBanner';
import BibtexEntry from './BibtexEntry';
import Acknowledgments from './Acknowledgments';
import Footer from './Footer';

function renderIconForLinkType(type) {
  const iconSx = { mr: 1 };
  switch (type) {
    case 'github':
      return <GitHubIcon sx={iconSx} />;
    case 'paper':
    case 'supplemental':
      return <DescriptionOutlinedIcon sx={iconSx} />;
    case 'archive':
      return <ArchiveOutlinedIcon sx={iconSx} />;
    case 'viewer':
      return <OpenInBrowser sx={iconSx} />;
    case 'presentation':
      return <SlideshowOutlinedIcon sx={iconSx} />;
    case 'scrollVideo':
      return <VideocamOutlinedIcon sx={iconSx} />;
    case 'acm':
      return <ACMIcon sx={{ mr: 1, fill: 'currentColor', height: '1.35rem' }} />;
    default:
      return <OpenInBrowser sx={iconSx} />;
  }
}

function renderAbstractParagraph(paragraph, abstractLink) {
  if (abstractLink && paragraph.includes(abstractLink.match)) {
    const parts = paragraph.split(abstractLink.match);
    return (
      <>
        {parts[0]}
        <Link href={abstractLink.url} target="_blank" rel="noopener noreferrer">
          {abstractLink.match}
        </Link>
        {parts[1]}
      </>
    );
  }
  return paragraph;
}

function PublicationLayout({ publication }) {
  const theme = useTheme();
  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));
  const presentationRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!presentationRef.current) return;
    if (!document.fullscreenElement) {
      presentationRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [publication?.id]);

  if (!publication) return null;

  const handleScrollToTarget = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mdHorizontalPadding =
    publication.rootPaddingMd !== undefined ? `${publication.rootPaddingMd}px` : '100px';
  const smHorizontalPadding =
    publication.rootPaddingSm !== undefined ? `${publication.rootPaddingSm}px` : null;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderColor: 'divider',
        borderStyle: 'solid',
        borderWidth: '0px 1px 0px 1px',
        boxShadow: '0 0 32px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box
        sx={{
          p: {
            xs: '30px 20px 20px 20px',
            sm: smHorizontalPadding
              ? `60px ${smHorizontalPadding} 50px ${smHorizontalPadding}`
              : '30px 20px 20px 20px',
            md: smHorizontalPadding
              ? `60px ${smHorizontalPadding} 50px ${smHorizontalPadding}`
              : `60px ${mdHorizontalPadding} 50px ${mdHorizontalPadding}`,
          },
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems={smallWidth ? 'flex-start' : 'center'}
        >
          <Grid item sx={{ width: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              {publication.title}
            </Typography>

            <AuthorBanner authorData={publication.authors} />

            <Typography gutterBottom sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {publication.venuePrefix}{' '}
              <Link
                href={publication.venueUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {publication.venueLinkText}
              </Link>{' '}
              {publication.venueSuffix}
            </Typography>

            {/* Teaser Card */}
            {publication.teaserFixedDimensions ? (
              <Card
                sx={{
                  mt: '30px',
                  mx: 'auto',
                  height: { xs: 225, sm: 300, md: 450 },
                  width: { xs: '100%', sm: 600, md: 800 },
                }}
              >
                <CardMedia
                  sx={{ height: '100%', width: '100%' }}
                  image={publication.teaserImage}
                  title={publication.teaserCaption || publication.title}
                />
              </Card>
            ) : (
              <Card
                variant={publication.teaserFlat ? 'outlined' : 'elevation'}
                sx={{
                  mt: '30px',
                  width: '100%',
                  ...(publication.teaserFlat && {
                    bgcolor: 'rgba(0, 0, 0, 0)',
                    borderRadius: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    boxShadow: 'none',
                  }),
                }}
              >
                <CardMedia
                  sx={{
                    boxShadow: 0,
                    height: 0,
                    paddingTop: publication.teaserPaddingTop || '42.5%',
                  }}
                  image={publication.teaserImage}
                  title={publication.teaserCaption || publication.title}
                />
              </Card>
            )}

            <Grid item sx={{ mt: '30px' }}>
              {/* Buttons Bar */}
              {publication.links && publication.links.length > 0 && (
                <Grid
                  container
                  direction={smallWidth ? 'column' : 'row'}
                  justifyContent="center"
                  alignItems="center"
                  columnSpacing={1.25}
                  rowSpacing={1.25}
                >
                  {publication.links.map((item) => (
                    <Grid item key={item.label}>
                      {item.type === 'scrollVideo' ? (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleScrollToTarget(item.targetId)}
                        >
                          {renderIconForLinkType(item.type)}
                          {item.label}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={item.url}
                          disabled={Boolean(item.disabled)}
                        >
                          {renderIconForLinkType(item.type)}
                          {item.label}
                        </Button>
                      )}
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Abstract */}
              <Grid item sx={{ mt: smallWidth ? '20px' : '40px' }}>
                <Typography variant="h6" gutterBottom>
                  <Box fontWeight={600}>Abstract</Box>
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {publication.abstract.map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {renderAbstractParagraph(paragraph, publication.abstractLink)}
                    </React.Fragment>
                  ))}
                </Typography>
              </Grid>

              {/* Interactive Presentation (e.g. Directional Hash Encoding) */}
              {publication.interactivePresentation && (
                <Grid item sx={{ mt: smallWidth ? '20px' : '40px' }}>
                  <Typography variant="h5" gutterBottom>
                    <Box fontWeight={600}>{publication.interactivePresentation.title}</Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {publication.interactivePresentation.subtitle}
                  </Typography>
                  <Box
                    ref={presentationRef}
                    sx={{
                      position: 'relative',
                      paddingTop: isFullscreen ? 0 : '56.25%',
                      height: isFullscreen ? '100vh' : 'auto',
                      marginTop: 2,
                      border: isFullscreen ? 'none' : '1px solid',
                      borderColor: 'divider',
                      borderRadius: isFullscreen ? 0 : 1,
                      overflow: 'hidden',
                      background: '#000',
                    }}
                  >
                    <iframe
                      src={publication.interactivePresentation.url}
                      title={publication.interactivePresentation.iframeTitle}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                      allowFullScreen
                    />
                    <IconButton
                      onClick={toggleFullscreen}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        '&:hover': { background: 'rgba(0,0,0,0.7)' },
                        zIndex: 10,
                      }}
                    >
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Box>
                </Grid>
              )}

              {/* Custom Sections (e.g. Practical Reconstruction & Multilayered) */}
              {publication.sections &&
                publication.sections.map((section) => (
                  <Grid
                    item
                    key={section.title}
                    sx={{ mt: section.titleVariant === 'h6' ? '10px' : smallWidth ? '20px' : '40px' }}
                  >
                    <Typography variant={section.titleVariant || 'h5'} gutterBottom>
                      <Box fontWeight={600}>{section.title}</Box>
                    </Typography>

                    {section.description && (
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {section.description}
                        {section.viewerCallout && (
                          <>
                            {' '}
                            {section.viewerCallout.prefix}
                            <Link
                              href={section.viewerCallout.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {section.viewerCallout.linkText}
                            </Link>
                            {section.viewerCallout.suffix}
                          </>
                        )}
                      </Typography>
                    )}

                    {/* 2-Column Card Figures (Practical Reconstruction) */}
                    {section.cardFigures && (
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={5}
                      >
                        {section.cardFigures.map((fig) => (
                          <Grid item key={fig.title}>
                            <Card
                              sx={{
                                mt: '30px',
                                p: '0.1em',
                                pt: '0.5em',
                                width: { xs: '100%', sm: 500 },
                                height: '100%',
                              }}
                            >
                              <CardMedia
                                sx={{
                                  boxShadow: 0,
                                  height: 0,
                                  paddingTop: fig.paddingTop,
                                }}
                                image={fig.image}
                                title={fig.title}
                              />
                              <CardContent>
                                <i>{fig.caption}</i>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}

                    {/* Stacked Figures (Multilayered) */}
                    {section.stackedFigures && (
                      <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {section.stackedFigures.map((fig) => (
                          <React.Fragment key={fig.title}>
                            <Card
                              sx={{
                                mt: '30px',
                                mb: '30px',
                                height: { xs: 300, sm: fig.size },
                                width: { xs: '100%', sm: fig.size },
                                ...(fig.borderless && {
                                  border: 'none',
                                  boxShadow: 'none',
                                }),
                              }}
                            >
                              <CardMedia
                                sx={{ height: '100%', width: '100%' }}
                                image={fig.image}
                                title={fig.title}
                              />
                            </Card>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              gutterBottom
                              sx={{ maxWidth: { xs: '100%', sm: '70%' } }}
                            >
                              <i>{fig.caption}</i>
                            </Typography>
                          </React.Fragment>
                        ))}
                      </Grid>
                    )}

                    {/* Video Cards (Practical Reconstruction Facial Appearance) */}
                    {section.videoCards && (
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={5}
                        sx={{ mt: smallWidth ? '10px' : '20px' }}
                      >
                        {section.videoCards.map((vid, idx) => (
                          <Grid item key={idx}>
                            <Card
                              sx={{
                                m: 0,
                                p: 0,
                                pb: 0,
                                width: { xs: '100%', sm: 500 },
                                height: '100%',
                                borderRadius: 1,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                component="video"
                                src={vid.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                sx={{
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block',
                                }}
                              />
                              <CardContent>
                                <i>{vid.caption}</i>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                ))}

              {/* Videos (Fast Forward / Supplemental / YouTube) */}
              {publication.videos &&
                publication.videos.map((videoItem, idx) => (
                  <Grid
                    item
                    key={videoItem.title || idx}
                    id={videoItem.id || undefined}
                    sx={{ mt: smallWidth ? '20px' : '40px' }}
                  >
                    {videoItem.title && (
                      <Typography variant="h5" gutterBottom>
                        <Box fontWeight={600}>{videoItem.title}</Box>
                      </Typography>
                    )}

                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        mt: videoItem.title ? (smallWidth ? '20px' : '40px') : 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: '#000',
                      }}
                    >
                      {videoItem.type === 'youtube' ? (
                        <Box
                          component="iframe"
                          src={videoItem.embedUrl}
                          title={videoItem.title || publication.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                          }}
                        />
                      ) : (
                        <Box
                          component="video"
                          src={videoItem.url}
                          controls
                          preload="metadata"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      )}
                    </Box>

                    {videoItem.footnote && (
                      <Box sx={{ mt: smallWidth ? '20px' : '40px' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: '10px' }}>
                          {videoItem.footnote.prefix}
                          <Link
                            href={videoItem.footnote.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {videoItem.footnote.linkText}
                          </Link>
                          {videoItem.footnote.suffix}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                ))}

              {/* BibTeX */}
              {publication.bibtex && (
                <Grid item sx={{ mt: smallWidth ? '20px' : '40px' }}>
                  <BibtexEntry bibtexString={publication.bibtex} />
                </Grid>
              )}

              {/* Acknowledgements */}
              {(publication.primeAcknowledgment || publication.customAcknowledgments) && (
                <Grid item sx={{ mt: smallWidth ? '20px' : '40px' }}>
                  <Acknowledgments customText={publication.customAcknowledgments} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Container>
  );
}

PublicationLayout.propTypes = {
  publication: PropTypes.object.isRequired,
};

export default PublicationLayout;
