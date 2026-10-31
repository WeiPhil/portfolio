import React from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Grid,
  Link,
  Button,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { profileData } from '../data/portfolioData';

function PresentationCard() {
  const theme = useTheme();
  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));

  const portraitCard = (
    <Card
      elevation={0}
      sx={{
        mt: smallWidth ? '24px' : '12px',
        mb: smallWidth ? '8px' : 0,
        height: smallWidth ? 210 : 255,
        width: smallWidth ? 165 : 190,
        mx: smallWidth ? 'auto' : 0,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.1)',
      }}
    >
      <CardMedia
        sx={{ height: '100%', maxWidth: '100%' }}
        image={profileData.avatar}
        title="Philippe Weier"
      />
    </Card>
  );

  return (
    <Box
      sx={{
        p: { xs: '24px 16px', sm: '52px 48px 44px 48px' },
      }}
    >
      <Grid
        container
        direction={smallWidth ? 'column' : 'row'}
        alignItems={smallWidth ? 'center' : 'flex-start'}
        spacing={smallWidth ? 0 : 4}
      >
        {!smallWidth && (
          <Grid item md={3}>
            {portraitCard}
          </Grid>
        )}

        <Grid item md={smallWidth ? true : 9}>
          <Grid container direction="column" alignItems="center">
            <Grid item sx={{ pt: smallWidth ? '8px' : '2px', width: '100%' }}>
              <Typography
                component={smallWidth ? 'h2' : 'h4'}
                variant={smallWidth ? 'h3' : 'h4'}
                align={smallWidth ? 'center' : 'inherit'}
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {profileData.name}
              </Typography>

              {smallWidth && portraitCard}

              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                sx={{ mt: '24px' }}
              >
                I am currently a Research Scientist at Google Zurich. Previously, I did my PhD at
                the University of Saarland, where I was a Marie Skłodowska-Curie Fellow of the EU
                Project{' '}
                <Link target="_blank" rel="noopener noreferrer" href="https://prime-itn.eu/">
                  PRIME
                </Link>{' '}
                under the supervision of Philipp Slusallek. My research focuses on appearance
                modelling and filtering, differentiable rendering and neural representations. During
                my PhD I also had the opportunity to intern at various companies including Intel,
                Adobe, Google and Meta. <br /> Before that, I graduated with a Masters in Computer
                Science at the{' '}
                <Link target="_blank" rel="noopener noreferrer" href="https://www.epfl.ch/">
                  École Polytechnique Fédérale de Lausanne (EPFL)
                </Link>{' '}
                and worked as a Rendering Researcher at{' '}
                <Link target="_blank" rel="noopener noreferrer" href="https://www.wetafx.co.nz/">
                  Weta Digital
                </Link>
                , where I improved the performance of light transport algorithms in the in-house{' '}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.wetafx.co.nz/research-and-tech/technology/manuka/"
                >
                  Manuka Renderer
                </Link>
                .
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                sx={{ mt: '12px' }}
              >
                In my free time, when not programming some toy project, I like to play all sorts of
                instruments, including the euphonium, the trumpet and the saxophone. You might also
                see me paint miniatures, climbing walls or surfing :)
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: '20px', mb: '24px' }}
              >
                Feel free to{' '}
                <Link href={`mailto:${profileData.email}`}>contact me</Link> if you have any
                questions or simply want to chat.
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              target="_blank"
              rel="noopener noreferrer"
              href={profileData.cvUrl}
            >
              <DescriptionOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
              CV
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PresentationCard;
