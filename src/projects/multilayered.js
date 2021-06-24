import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Grid, Link, Button, Box } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ArchiveIcon from '@material-ui/icons/Archive';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles(theme => ({
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


function Multilayered(props) {
  const theme = useTheme();
  const classes = useStyles();

  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));

  const [paperLink, paperLinkLabel] = ["http://jcgt.org/published/0009/02/03/paper.pdf", "Paper (10.8 MiB)"];
  const archiveDatas = [["http://jcgt.org/published/0009/02/03/mitsuba_supplemental.zip", "Code (20.8 KiB)"], ["http://jcgt.org/published/0009/02/03/html_supplemental.zip", "Supplemental (4.1 GiB)"]];


  return (
    <div className={classes.root}>

      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems={smallWidth ? "flex-start" : "center"}
      >

        <Grid item  >

          <Typography variant="h5" gutterBottom>
            <Box fontWeight="fontWeightRegular">Rendering Layered Materials with Anisotropic Interfaces</Box>
          </Typography>

          <Typography>
            <StyledLink href={process.env.PUBLIC_URL + "/"}>Philippe Weier</StyledLink> and <StyledLink href="https://belcour.github.io/blog/">Laurent Belcour</StyledLink>, 2020
          </Typography>

          <Typography gutterBottom>
            Published in Journal of Computer Graphics Techniques (<StyledLink href="http://jcgt.org/">JCGT</StyledLink>)
          </Typography>

          <Card className={classes.card}>
            <CardMedia className={classes.image}
              image={require('../data/images/layered/layered_aniso.png')}
              title="Layered Teaser"
            />
          </Card>

          <Grid item style={{ marginTop: 10 }}>
            <Grid
              container
              direction={smallWidth ? "column" : "row"}
              justify="flex-start"
              alignItems="center"
            >

              <Grid item  >
                <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={paperLink}><DescriptionIcon className={classes.icon} />
                  {paperLinkLabel}
                </Button>
              </Grid>

              {archiveDatas.map(([archiveLink, archiveLinkLabel],) => (
                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={archiveLink}><ArchiveIcon className={classes.icon} />
                    {archiveLinkLabel}
                  </Button>
                </Grid>
              ))}

            </Grid>


            <Grid item style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }} >
              <Typography variant="h6" gutterBottom>
                <Box fontWeight={500}>Abstract</Box>
              </Typography>
              <Typography variant="body1" gutterBottom>
                We present a lightweight and efficient method to render layered materials with anisotropic interfaces. Our work extends the statistical framework of <StyledLink href="https://belcour.github.io/blog/research/2018/05/05/brdf-realtime-layered.html">Belcour [2018]</StyledLink> to handle anisotropic microfacet models. A key insight to our work is that when projected on the tangent plane, BRDF lobes from an anisotropic GGX distribution are well approximated by ellipsoidal distributions aligned with the tangent frame: its covariance matrix is diagonal in this space. We leverage this property and perform the adding-doubling algorithm on each anisotropy axis independently. We further update the mapping of roughness to directional variance and the evaluation of the average reflectance to account for anisotropy. We extensively tested this model against ground truth.
              </Typography>


              <Typography variant="h6" gutterBottom style={{ marginTop: 10 }}>
                <Box fontWeight={500}>Validation</Box>
              </Typography>
              <Typography variant="body1" gutterBottom>
                  We validated that our model was visualy close to the ground truth. See our supplemental material for all our results (warning: the archive is > 4GB).
              </Typography>
            </Grid>
            <Grid
              container
              direction={"column"}
              justify="center"
              alignItems="center"
            >

              <Card className={classes.mainComparCard} style={{ border: "none", boxShadow: "none" }}>
                <CardMedia className={classes.image}
                  image={require('../data/images/layered/layered_aniso_05_05_top_varying.png')}
                  title="layered_aniso_05_05_top_varying"
                />
              </Card>
              <Typography variant="body1" gutterBottom className={classes.figureLegend}>
                <i>
                  Example of the validation of our layered model with respect to the ground truth when changing the roughness of the top dielectric layer.
                </i>
              </Typography>


              <Card className={classes.grazingCard} >
                <CardMedia className={classes.image}
                  image={require('../data/images/layered/grazing_angles_overblur.png')}
                  title="layered_aniso_05_05_top_varying"
                />
              </Card>
              <Typography variant="body1" gutterBottom className={classes.figureLegend}>
                <i>
                  Our method differs from the reference at grazing angles. This is due to the correlation between total internal reflection (TIR) and our precomputed average reflectance for one bounce. Since we do not account for it, our model overblurs the reflectance at grazinangles.
                </i>
              </Typography>

            </Grid>



          </Grid>


        </Grid>



      </Grid >

    </div >
  );

}

export default Multilayered;