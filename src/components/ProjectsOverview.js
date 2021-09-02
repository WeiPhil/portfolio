import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import { Grid, withStyles, Link, Divider, Box } from "@material-ui/core";
import ProjectCard from "./ProjectCard";

const StyledTabs = withStyles((theme) => ({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 80,
      width: "100%",
      backgroundColor: theme.palette.primary.main,
    },
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const styles = (theme) => ({
  content: {
    margin: 40,
    height: "100%",
    [theme.breakpoints.down("md")]: {
      margin: 15,
    },
  },
  tabView: {
    marginTop: 50,
    height: "100%",
  },
  tab: {
    textTransform: "none",
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: "#757575",
  },

  button: {
    textTransform: "none",
    margin: theme.spacing(2),
  },
});

const StyledLink = withStyles((theme) => ({
  root: {
    "&:hover": {
      color: "#af7b6b",
    },
  },
}))((props) => <Link underline="none" {...props} />);

class ProjectsOverview extends Component {
  state = {
    tabValue: 0,
  };

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { classes } = this.props;

    // Course Projects

    // Advanced Computer Graphics
    const cs440Subtitle = (
      <>
        Implementation and extension of a ray tracer in C++ using the{" "}
        <StyledLink href="https://wjakob.github.io/nori/">
          Nori framework
        </StyledLink>
        , 2018
      </>
    );
    const cs440Description = (
      <>
        During the course given by{" "}
        <StyledLink href="https://rgl.epfl.ch/people/wjakob/">
          Wenzel Jakob
        </StyledLink>{" "}
        at EPFL I extended my ray tracer with various features including a
        volumetric path tracer and won the 2nd place in the yearly rendering
        competition.
      </>
    );
    const cs440Project = (
      <ProjectCard
        image={require("../data/images/cs440.png")}
        title="Advanced Computer Graphics"
        subtitle={cs440Subtitle}
        description={cs440Description}
        projectPageLink={"https://weiphil.github.io/acg2018/"}
      />
    );

    // Computational Photography

    const imageAndVideoSubtitle = (
      <>
        GPU implementation of different light field reconstruction algorithms
        using OpenGL3, 2019
      </>
    );
    const imageAndVideoDescription = (
      <>
        During the Image and Video processing course (EE550) at EPFL I
        implemented different reconstruction algorithms of the plenoptic
        function. It is mainly based on previous work on Light Field Rendering
        by{" "}
        <StyledLink href="https://graphics.stanford.edu/~levoy/">
          Marc Levoy
        </StyledLink>{" "}
        and{" "}
        <StyledLink href="https://graphics.stanford.edu/~renng/">
          Ren Ng
        </StyledLink>
        . This includes a view-based reconstruction, digital refocusing and
        dynamic aperture change.
      </>
    );
    const imageAndVideoProject = (
      <ProjectCard
        image={require("../data/images/imageAndVideoProc.gif")}
        title="Computational Photography"
        subtitle={imageAndVideoSubtitle}
        description={imageAndVideoDescription}
        githubLink={"https://github.com/WeiPhil/LightFieldImaging"}
      />
    );

    // TODO Semester project

    // Publications
    const layeredAnisoDescription = (
      <>
        <Box fontWeight={500} style={{ marginTop: 5 }}>
          Abstract{" "}
        </Box>
        We present a lightweight and efficient method to render layered
        materials with anisotropic interfaces. Our work extends the statistical
        framework of{" "}
        <StyledLink href="https://belcour.github.io/blog/research/2018/05/05/brdf-realtime-layered.html">
          Belcour [2018]
        </StyledLink>{" "}
        to handle anisotropic microfacet models. A key insight to our work is
        that when projected on the tangent plane, BRDF lobes from an anisotropic
        GGX distribution are well approximated by ellipsoidal distributions
        aligned with the tangent frame: its covariance matrix is diagonal in
        this space. We leverage this property and perform the adding-doubling
        algorithm on each anisotropy axis independently. We further update the
        mapping of roughness to directional variance and the evaluation of the
        average reflectance to account for anisotropy. We extensively tested
        this model against ground truth.
      </>
    );
    const layeredSubtitle = (
      <>
        Philippe Weier and Laurent Belcour, 2020
        <Box fontWeight={500} fontSize="fontSize">
          Published in Journal of Computer Graphics Techniques (JCGT)
        </Box>
      </>
    );
    const layeredAnisoProject = (
      <ProjectCard
        image={require("../data/layered/layered_aniso.png")}
        title="Rendering Layered Materials with Anisotropic Interfaces"
        subtitle={layeredSubtitle}
        description={layeredAnisoDescription}
        projectPageLink="/publications/multilayered"
        paperData={[
          "http://jcgt.org/published/0009/02/03/paper.pdf",
          "Paper (10.8 MiB)",
        ]}
        archiveDatas={[
          [
            "http://jcgt.org/published/0009/02/03/mitsuba_supplemental.zip",
            "Code (20.8 KiB)",
          ],
          [
            "http://jcgt.org/published/0009/02/03/html_supplemental.zip",
            "Supplemental (4.1 GiB)",
          ],
        ]}
      />
    );

    const opsrDescription = (
      <>
        <Box fontWeight={500}>Abstract </Box>
        We present Optimised Path Space Regularisation (OPSR), a novel
        regularisation technique for forward path tracing algorithms. Our
        regularisation controls the amount of roughness added to materials
        depending on the type of sampled paths and trades a small error in the
        estimator for a drastic reduction of variance in difficult paths,
        including indirectly visible caustics. We formulate the problem as a
        joint bias-variance minimisation problem and use differentiable
        rendering to optimise our model. The learnt parameters generalise to a
        large variety of scenes irrespective of their geometric complexity. The
        regularisation added to the underlying light transport algorithm
        naturally allows us to handle the problem of near-specular and glossy
        path chains robustly. Our method consistently improves the convergence
        of path tracing estimators, including state-of-the-art path guiding
        techniques where it enables finding otherwise hard-to-sample paths and
        thus, in turn, can significantly speed up the learning of guiding
        distributions.
      </>
    );
    const opsrSubtitle = (
      <>
        Philippe Weier, Marc Droske, Johannes Hanika, Andrea Weidlich, Jiří
        Vorba, 2021
        <Box fontWeight={500} fontSize="fontSize">
          Published in Computer Graphics Forum (Proceedings of Eurographics
          Symposium on Rendering)
        </Box>
      </>
    );
    const opsrProject = (
      <ProjectCard
        image={require("../data/opsr/beach_thumbnail.png")}
        title="Optimised Path Space Regularisation"
        subtitle={opsrSubtitle}
        description={opsrDescription}
        projectPageLink="/publications/opsr"
        paperData={[
          "https://weiphil.s3.eu-central-1.amazonaws.com/OPSR_EGSR2021.pdf",
          "Paper (58.8 MiB)",
        ]}
        archiveDatas={[
          [
            "https://weiphil.s3.eu-central-1.amazonaws.com/opsr_supplemental.zip",
            "Supplemental (153.8 MB)",
          ],
        ]}
        presentationData={[
          "https://weiphil.s3.eu-central-1.amazonaws.com/opsr_egsr_presentation.pptx",
          "Presentation (40.8 MB)",
        ]}
      />
    );

    // Personal Projects

    const qulkanProject = (
      <ProjectCard
        image={require("../data/images/qulkanScreenshot.png")}
        title="Qulkan"
        subtitle="A GPU Oriented Prototyping tool in C++17, 2019"
        description={
          "Qulkan is a personal project designed to give a quick start to anyone considering using OpenGL or Vulkan as a graphical API. It has been designed to offer a simple and flexible interface for more complex software or research validation tools."
        }
        githubLink="https://github.com/WeiPhil/qulkan"
      />
    );

    const procaryotaProject = (
      <ProjectCard
        image={require("../data/images/procaryotaScreenshot.png")}
        title="Procaryota"
        subtitle="A 2D space-shooter like game in C#, 2018"
        description={
          "Procaryota is beeing developped in my free time for fun. You incarnate a little cell fighting evil viruses, continuously evolving and trying to make his way through a dangerous environment."
        }
        githubLink="https://github.com/WeiPhil/Procaryota"
      />
    );

    const lotrDescription = (
      <>
        The Lotr Army Companion App is a full-stack Web Application created in
        React. It has been created for the table-top game{" "}
        <StyledLink href="https://www.games-workshop.com/en-EU/Middle-earth">
          Middle-Earth Strategy Battle Game
        </StyledLink>{" "}
        and its unofficial extension Battle Companies. It has a full database of
        all the Middle-Earth characters and an interactive army creation
        interface allowing you to quickly build up any army you would like to
        play.
      </>
    );
    const lotrProject = (
      <ProjectCard
        image={require("../data/images/lotrScreenshot.png")}
        title="Lotr Army Companion App"
        subtitle="Lord of the Ring: An unofficial companion App for your armies, 2018"
        description={lotrDescription}
        githubLink="https://github.com/WeiPhil/LotrArmyCompanion"
      />
    );

    ///////////////////////

    const publications = [opsrProject, layeredAnisoProject];
    const personalProjects = [qulkanProject, procaryotaProject, lotrProject];
    const studyProjects = [cs440Project, imageAndVideoProject];

    return (
      <div className={classes.content}>
        <StyledTabs
          variant="fullWidth"
          value={this.state.tabValue}
          onChange={this.handleTabChange}
        >
          <Tab disableRipple className={classes.tab} label="Publications" />
          <Tab
            disableRipple
            className={classes.tab}
            label="Personal Projects"
          />
          <Tab disableRipple className={classes.tab} label="Study Projects" />
        </StyledTabs>

        <SwipeableViews
          enableMouseEvents
          onSwitching={(i, type) => {
            if (type === "end") {
              this.setState({ tabValue: i });
            }
          }}
          className={classes.tabView}
          index={this.state.tabValue}
        >
          <Grid container direction="column">
            {publications.map((projectCard, index) => (
              <div key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: index !== 0 && 20 }} />
                )}
                <Grid item style={{ marginTop: index !== 0 && 40 }}>
                  {projectCard}
                </Grid>
              </div>
            ))}
          </Grid>

          <Grid container direction="column">
            {personalProjects.map((projectCard, index) => (
              <div key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: index !== 0 && 20 }} />
                )}
                <Grid item key={index} style={{ marginTop: index !== 0 && 40 }}>
                  {projectCard}
                </Grid>
              </div>
            ))}
          </Grid>

          <Grid container direction="column">
            {studyProjects.map((projectCard, index) => (
              <div key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: index !== 0 && 20 }} />
                )}
                <Grid item key={index} style={{ marginTop: index !== 0 && 40 }}>
                  {projectCard}
                </Grid>
              </div>
            ))}
          </Grid>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ProjectsOverview);
