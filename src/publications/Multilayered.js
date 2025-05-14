import React from "react";
import { makeStyles, withStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Link, Button, Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArchiveIcon from "@mui/icons-material/Archive";
import DescriptionIcon from "@mui/icons-material/Description";

import BibtexEntry from "../components/BibtexEntry";
import Footer from "../components/Footer";
import AuthorBanner from "../components/AuthorBanner";

const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.down("sm")]: {
      paddingTop: 30,
      padding: 20,
    },
    [theme.breakpoints.up("sm")]: {
      paddingLeft: 150,
      paddingRight: 150,
    },
  },
  card: {
    marginTop: 30,
    height: 450,
    width: 800,
    [theme.breakpoints.down("md")]: {
      height: 300,
      width: 600,
    },
    [theme.breakpoints.down("sm")]: {
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
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: 300,
    },
  },
  mainComparCard: {
    marginTop: 30,
    marginBottom: 30,
    height: 600,
    width: 600,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: 300,
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  figureLegend: {
    maxWidth: "70%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  paperTitles: {
    textAlign: "center"
  }
}));

const StyledLink = withStyles((theme) => ({
  root: {
    "&:hover": {
      color: "#af7b6b",
    },
  },
}))((props) => <Link underline="none" {...props} />);

function Multilayered(props) {
  window.scrollTo(0, 0);

  const theme = useTheme();
  const classes = useStyles();

  const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

  const [paperLink, paperLinkLabel] = [
    "http://jcgt.org/published/0009/02/03/paper.pdf",
    "Paper (10.8 MB)",
  ];
  const archiveDatas = [
    [
      "http://jcgt.org/published/0009/02/03/mitsuba_supplemental.zip",
      "Code (20.8 KB)",
    ],
    [
      "http://jcgt.org/published/0009/02/03/html_supplemental.zip",
      "Supplemental (4.1 GB)",
    ],
  ];

  const authorData = [
    {
      name: "Philippe Weier", affiliations: ["EPFL", "Unity Technologies"]
    },
    {
      name: <StyledLink href="https://belcour.github.io/blog/">
        Laurent Belcour
      </StyledLink>, affiliations: ["Unity Technologies"]
    },
  ]

  const multilayeredBibtex = `@article{Weier2020Layered,
  author =       {Philippe Weier and Laurent Belcour}, 
  title =        {Rendering Layered Materials with Anisotropic Interfaces},
  year =         2020,
  month =        {June},
  day =          20,
  journal =      {Journal of Computer Graphics Techniques (JCGT)},
  volume =       9,
  number =       2,
  pages =        {37--57},
  url =          {http://jcgt.org/published/0009/02/03/},
  issn =         {2331-7418}
}  `

  return (
    <Container className={classes.content}>
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems={smallWidth ? "flex-start" : "center"}
        >
          <Grid item>
            <Typography variant="h5" gutterBottom className={classes.paperTitles}>
              <Box fontWeight="fontWeightRegular">
                Rendering Layered Materials with Anisotropic Interfaces
              </Box>
            </Typography>

            <AuthorBanner authorData={authorData} />

            <Typography gutterBottom className={classes.paperTitles}>
              Published in Journal of Computer Graphics Techniques (
              <StyledLink href="http://jcgt.org/">JCGT</StyledLink>)
            </Typography>

            <Card className={classes.card}>
              <CardMedia
                className={classes.image}
                image={require("../data/layered/layered_aniso.png")}
                title="Layered Teaser"
              />
            </Card>

            <Grid item style={{ marginTop: 30 }}>
              <Grid
                container
                direction={smallWidth ? "column" : "row"}
                justifyContent="center"
                alignItems="center"
                columnSpacing={1}
                rowSpacing={1}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    target="_blank"
                    href={paperLink}
                  >
                    <DescriptionIcon className={classes.icon} />
                    {paperLinkLabel}
                  </Button>
                </Grid>

                {archiveDatas.map(([archiveLink, archiveLinkLabel]) => (
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      target="_blank"
                      href={archiveLink}
                    >
                      <ArchiveIcon className={classes.icon} />
                      {archiveLinkLabel}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Grid
                item
                style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
              >
                <Typography variant="h6" gutterBottom>
                  <Box fontWeight={500}>Abstract</Box>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  We present a lightweight and efficient method to render
                  layered materials with anisotropic interfaces. Our work
                  extends the statistical framework of{" "}
                  <StyledLink href="https://belcour.github.io/blog/research/2018/05/05/brdf-realtime-layered.html">
                    Belcour [2018]
                  </StyledLink>{" "}
                  to handle anisotropic microfacet models. A key insight to our
                  work is that when projected on the tangent plane, BRDF lobes
                  from an anisotropic GGX distribution are well approximated by
                  ellipsoidal distributions aligned with the tangent frame: its
                  covariance matrix is diagonal in this space. We leverage this
                  property and perform the adding-doubling algorithm on each
                  anisotropy axis independently. We further update the mapping
                  of roughness to directional variance and the evaluation of the
                  average reflectance to account for anisotropy. We extensively
                  tested this model against ground truth.
                </Typography>

                <Typography variant="h6" gutterBottom style={{ marginTop: 10 }}>
                  <Box fontWeight={500}>Validation</Box>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  We validated that our model was visualy close to the ground
                  truth. See our supplemental material for all our results
                  (warning: the archive is &gt; 4GB).
                </Typography>
              </Grid>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems="center"
              >
                <Card
                  className={classes.mainComparCard}
                  style={{ border: "none", boxShadow: "none" }}
                >
                  <CardMedia
                    className={classes.image}
                    image={require("../data/layered/layered_aniso_05_05_top_varying.png")}
                    title="layered_aniso_05_05_top_varying"
                  />
                </Card>
                <Typography
                  variant="body1"
                  gutterBottom
                  className={classes.figureLegend}
                >
                  <i>
                    Example of the validation of our layered model with respect
                    to the ground truth when changing the roughness of the top
                    dielectric layer.
                  </i>
                </Typography>

                <Card className={classes.grazingCard}>
                  <CardMedia
                    className={classes.image}
                    image={require("../data/layered/grazing_angles_overblur.png")}
                    title="layered_aniso_05_05_top_varying"
                  />
                </Card>
                <Typography
                  variant="body1"
                  gutterBottom
                  className={classes.figureLegend}
                >
                  <i>
                    Our method differs from the reference at grazing angles.
                    This is due to the correlation between total internal
                    reflection (TIR) and our precomputed average reflectance for
                    one bounce. Since we do not account for it, our model
                    overblurs the reflectance at grazing angles.
                  </i>
                </Typography>
              </Grid>
              <Grid
                item
                style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
              >
                <BibtexEntry bibtexString={multilayeredBibtex} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Footer />
    </Container>
  );
}

export default Multilayered;
