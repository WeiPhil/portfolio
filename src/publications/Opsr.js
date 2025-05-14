import React from "react";
import { makeStyles, withStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Link, Button, Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DescriptionIcon from "@mui/icons-material/Description";
import ArchiveIcon from "@mui/icons-material/Archive";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import GitHubIcon from "@mui/icons-material/GitHub";
import ReactPlayer from "react-player";

import Footer from "../components/Footer";
import AuthorBanner from "../components/AuthorBanner";
import BibtexEntry from "../components/BibtexEntry";

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
        width: "100%",
    },
    image: {
        height: 0,
        paddingTop: '56.32%'
    },
    playerWrapper: {
        position: 'relative',
        paddingTop: '56.25%' /* 720 / 1280 = 0.5625 */
    },
    reactPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
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

function Opsr(props) {
    window.scrollTo(0, 0);

    const theme = useTheme();
    const classes = useStyles();

    const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

    const [paperLink, paperLinkLabel] = [
        "https://weiphil.s3.eu-central-1.amazonaws.com/OPSR_EGSR2021.pdf",
        "Paper (58.8 MB)",
    ];
    const [supplementalLink, supplementalLabel] = [
        "https://weiphil.s3.eu-central-1.amazonaws.com/opsr_supplemental.zip",
        "Supplemental (153.8 MB)",
    ];
    const [presentationLink, presentationLabel] = [
        "https://weiphil.s3.eu-central-1.amazonaws.com/opsr_egsr_presentation.pptx",
        "Presentation (40.8 MB)",
    ]

    const [githubLink, githubLabel] = [
        "https://github.com/WeiPhil/OptimisedPathSpaceRegularisation",
        "Source Code",
    ];

    const authorData = [

        {
            name: "Philippe Weier", affiliations: ["Weta Digital"]
        },
        {
            name: <StyledLink href="https://marc.droske.org/">
                Marc Droske
            </StyledLink>, affiliations: ["Weta Digital"]
        },
        {
            name: <StyledLink href="https://jo.dreggn.org/home/">
                Johannes Hanika
            </StyledLink>, affiliations: ["Weta Digital", "Karlsruhe Institute of Technology"]
        },
        {
            name: <StyledLink href="https://research.nvidia.com/person/andrea-weidlich">
                Andrea Weidlich
            </StyledLink>, affiliations: ["Weta Digital"]
        },
        {
            name: <StyledLink href="https://cgg.mff.cuni.cz/~jirka/">
                Jiří Vorba
            </StyledLink>, affiliations: ["Weta Digital", "Charles University"]
        },
    ]
    const opsrBibtex = `@article{Weier2021Opsr,
  author = {Weier, Philippe and Droske, Marc and Hanika, Johannes and Weidlich, Andrea and Vorba, Jiří},
  title = {Optimised Path Space Regularisation},
  year = 2021,
  journal = {Computer Graphics Forum (Proceedings of Eurographics Symposium on Rendering)},
  year = 2021,
  volume = 40,
  number = 4,
  doi = {10.1111/cgf.14347}
}`

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
                                {" "}
                                Optimised Path Space Regularisation
                            </Box>
                        </Typography>

                        <Typography className={classes.paperTitles}>
                            <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>
                            , Marc Droske, Johannes Hanika, Andrea Weidlich, Jiří Vorba, 2021
                        </Typography>

                        <AuthorBanner authorData={authorData} />

                        <Typography gutterBottom className={classes.paperTitles}>
                            Published in Computer Graphics Forum (Proceedings of{" "}
                            <StyledLink href="https://egsr.eu/">
                                Eurographics Symposium on Rendering
                            </StyledLink>
                            )
                        </Typography>

                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.image}
                                image={require("../data/opsr/beach_thumbnail.png")}
                                title="OPSR Teaser"
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
                                        href={githubLink}
                                    >
                                        <GitHubIcon className={classes.icon} />
                                        {githubLabel}
                                    </Button>
                                </Grid>

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

                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        className={classes.button}
                                        target="_blank"
                                        href={supplementalLink}
                                    >
                                        <ArchiveIcon className={classes.icon} />
                                        {supplementalLabel}
                                    </Button>
                                </Grid>

                                <Grid item>
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
                            </Grid>

                            <Grid
                                item
                                style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    <Box fontWeight={500}>Abstract</Box>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    We present Optimised Path Space Regularisation (OPSR), a novel
                                    regularisation technique for forward path tracing algorithms.
                                    Our regularisation controls the amount of roughness added to
                                    materials depending on the type of sampled paths and trades a
                                    small error in the estimator for a drastic reduction of
                                    variance in difficult paths, including indirectly visible
                                    caustics. We formulate the problem as a joint bias-variance
                                    minimisation problem and use differentiable rendering to
                                    optimise our model. The learnt parameters generalise to a
                                    large variety of scenes irrespective of their geometric
                                    complexity. The regularisation added to the underlying light
                                    transport algorithm naturally allows us to handle the problem
                                    of near-specular and glossy path chains robustly. Our method
                                    consistently improves the convergence of path tracing
                                    estimators, including state-of-the-art path guiding techniques
                                    where it enables finding otherwise hard-to-sample paths and
                                    thus, in turn, can significantly speed up the learning of
                                    guiding distributions.
                                </Typography>
                            </Grid>

                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                className={classes.playerWrapper}
                                style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
                            >
                                <ReactPlayer
                                    className={classes.reactPlayer}
                                    width='100%'
                                    height='100%'
                                    url={
                                        "https://weiphil.s3.eu-central-1.amazonaws.com/opsr_presentation_final.mp4"
                                    }
                                    controls={true}
                                />
                            </Box>
                            <Grid
                                item
                                style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
                            >

                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    style={{ marginTop: 10 }}
                                >
                                    The original EGSR talk can also be found{" "}
                                    <StyledLink
                                        href={"https://www.youtube.com/watch?v=u9HqKGqvJhQ&t=2074s"}
                                    >
                                        here
                                    </StyledLink>
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
                            >
                                <BibtexEntry bibtexString={opsrBibtex} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Footer />
        </Container>
    );
}

export default Opsr;
