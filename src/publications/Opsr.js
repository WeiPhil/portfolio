import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Grid, Link, Button, Box, Container } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import ReactPlayer from 'react-player'

import Footer from '../components/Footer'

const useStyles = makeStyles(theme => ({
  content: {
    height: "100%",
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[300],
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 1px",
    maxWidth: "xl",
  },
  root: {
    padding: 50,
    paddingTop: 60,
    paddingBottom: 50,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 30,
      padding: 20,
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 150,
      paddingRight: 150,
    },
  },
  card: {
    marginTop: 30,
    height: 450,
    width: 800,
    [theme.breakpoints.down('md')]: {
      height: 300,
      width: 600,
    },
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      height: 225,
    },

  },
  image: {
    height: "100%",
    width: "100%",
  },
  grazingCard: {
    marginTop: 30,
    marginBottom: 30,
    height: 450,
    width: 450,
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      height: 300,
    },
  },
  mainComparCard: {
    marginTop: 30,
    marginBottom: 30,
    height: 600,
    width: 600,
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      height: 300,
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  button: {
    textTransform: "none",
    margin: theme.spacing(0.5),
  },
  figureLegend: {
    maxWidth: "70%",
    [theme.breakpoints.down('sm')]: {
      maxWidth: "100%"
    },
  }
}));

const StyledLink = withStyles(theme => ({
  root: {
    '&:hover': {
      color: "#af7b6b",
    },
  }
}))(props => <Link underline="none" {...props} />);


function Opsr(props) {
  window.scrollTo(0, 0);

  const theme = useTheme();
  const classes = useStyles();

  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));

  const [paperLink, paperLinkLabel] = [require('../data/opsr/OPSR_EGSR2021.pdf'), "Paper (58.8 MiB)"];
  const [supplementalLink,supplementalLabel] = [require('../data/opsr/opsr_supplemental.zip'), "Supplemental (153.8 MB)"];
  const [presentationLink,presentationLabel] = [require('../data/opsr/opsr_egsr_presentation.pptx'), "Presentation (40.8 MB)"];

  return (
    <Container className={classes.content}>
      <div className={classes.root}>

        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems={smallWidth ? "flex-start" : "center"}
        >

          <Grid item  >

            <Typography variant="h5" gutterBottom>
              <Box fontWeight="fontWeightRegular">Optimised Path Space Regularisation</Box>
            </Typography>

            <Typography>
              <StyledLink href={process.env.PUBLIC_URL + "/"}>Philippe Weier</StyledLink>, Marc Droske, Johannes Hanika, Andrea Weidlich, Jiří Vorba, 2021
            </Typography>

            <Typography gutterBottom>
              Published in Computer Graphics Forum (Proceedings of <StyledLink href="https://egsr.eu/">Eurographics Symposium on Rendering</StyledLink>)
            </Typography>

            <Card className={classes.card}>
              <CardMedia className={classes.image}
                image={require('../data/opsr/beach_thumbnail.png')}
                title="OPSR Teaser"
              />
            </Card>
           
            <Grid item style={{ marginTop: 10 }}>
              <Grid
                container
                direction={smallWidth ? "column" : "row"}
                justify="flex-start"
                alignItems="center"
              >

                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={paperLink}><DescriptionIcon className={classes.icon} />
                    {paperLinkLabel}
                  </Button>
                </Grid>

                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={supplementalLink}><ArchiveIcon className={classes.icon} />
                    {supplementalLabel}
                  </Button>
                </Grid>

                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={presentationLink}><SlideshowIcon className={classes.icon} />
                    {presentationLabel}
                  </Button>
                </Grid>

              </Grid>


              <Grid item style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }} >
                <Typography variant="h6" gutterBottom>
                  <Box fontWeight={500}>Abstract</Box>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  We present Optimised Path Space Regularisation (OPSR), a novel regularisation technique for forward path tracing algorithms. Our regularisation controls the amount of roughness added to materials depending on the type of sampled paths and trades a small error in the estimator for a drastic reduction of variance in difficult paths, including indirectly visible caustics. We formulate the problem as a joint bias-variance minimisation problem and use differentiable rendering to optimise our model. The learnt parameters generalise to a large variety of scenes irrespective of their geometric complexity. The regularisation added to the underlying light transport algorithm naturally allows us to handle the problem of near-specular and glossy path chains robustly. Our method consistently improves the convergence of path tracing estimators, including state-of-the-art path guiding techniques where it enables finding otherwise hard-to-sample paths and thus, in turn, can significantly speed up the learning of guiding distributions.  
                </Typography>
                
              </Grid>

              <Grid item style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }} >
                <Typography variant="h6" gutterBottom style={{ marginTop: 10 }}>
                  <Box fontWeight={500}>
                  Presentation
                  </Box>
                </Typography>

                <ReactPlayer url={require('../data/opsr/opsr_presentation_final.mp4')} controls={true} />

                <Typography variant="body2" gutterBottom style={{ marginTop: 10 }}> 
                  The original EGSR talk can also be found <StyledLink href={'https://www.youtube.com/watch?v=u9HqKGqvJhQ&t=2074s'}>here</StyledLink> 
                </Typography>
                
              </Grid>

                <Typography variant="h6" gutterBottom style={{ marginTop: 50 }}>
                  <Box fontWeight={500}>More information soon!</Box>
                </Typography>


            </Grid>


          </Grid>



        </Grid >

      </div >
    <Footer />

    </Container>
  );

}

export default Opsr;