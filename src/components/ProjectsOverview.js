import React, { Component } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import { Grid, Link, Divider, Box } from "@mui/material";
import { withStyles } from "@mui/styles";

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
        During the Image and Video processing course (EE550) at EPFL, I
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
        <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box> and Laurent Belcour, 2020
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
        projectPageLink="./multilayered"
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
        <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Marc Droske, Johannes Hanika, Andrea Weidlich, Jiří
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
        projectPageLink="./opsr"
      />
    );

    const earsDescription = (
      <>
        <Box fontWeight={500}>Abstract </Box>
        Russian roulette and splitting are widely used techniques to increase the efficiency of Monte Carlo estimators. But, despite their popularity, there
        is little work on how to best apply them. Most existing approaches rely on
        simple heuristics based on, e.g., surface albedo and roughness. Their efficiency
        often hinges on user-controlled parameters. We instead iteratively learn optimal
        Russian roulette and splitting factors during rendering, using a simple and
        lightweight data structure. Given perfect estimates of variance and cost, our
        fixed-point iteration provably converges to the optimal Russian roulette and
        splitting factors that maximize the rendering efficiency. In our application
        to unidirectional path tracing, we achieve consistent and significant speed-ups
        over the state of the art.
      </>
    );
    const earsSubtitle = (
      <>
        Alexander Rath, Pascal Grittmann, Sebastian Herholz, <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Philipp Slusallek, 2022
        <Box fontWeight={500} fontSize="fontSize">
          ACM Transactions on Graphics (Proceedings of SIGGRAPH 2022)
        </Box>
      </>
    );
    const earsProject = (
      <ProjectCard
        image={require("../data/ears/ears_teaser.png")}
        title="EARS: Efficiency-Aware Russian Roulette and Splitting"
        subtitle={earsSubtitle}
        description={earsDescription}
        projectPageLink="./ears"
      />
    );

    const neuralLodDescription = (
      <>
        <Box fontWeight={500}>Abstract </Box>
        We introduce a practical general-purpose neural appearance filtering pipeline for physically-based rendering.
        We tackle the previously difficult challenge of aggregating visibility across many levels of detail from local information only, without relying on learning visibility for the entire scene. The high adaptivity of neural representations allows us to retain geometric correlations along rays and thus avoid light leaks.
        Common approaches to prefiltering decompose the appearance of a scene into volumetric representations with physically-motivated parameters, where the inflexibility of the fitted models limits rendering accuracy.
        We avoid assumptions on particular types of geometry or materials, bypassing any special-case decompositions. Instead, we directly learn a compressed representation of the intra-voxel light transport. For such high-dimensional functions, neural networks have proven to be useful representations.
        To satisfy the opposing constraints of prefiltered appearance and correlation-preserving point-to-point visibility, we use two small independent networks on a sparse multi-level voxel grid.
        Each network requires 10-20 minutes of training to learn the appearance of an asset across levels of detail. Our method achieves 70-95% compression ratios and around 25% of quality improvements over previous work. We reach interactive to real-time framerates, depending on the level of detail.
      </>
    );
    const neuralLodSubtitle = (
      <>
        <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Tobias Zirr, Anton Kaplanyan, Ling-Qi Yan, Philipp Slusallek, 2023
        <Box fontWeight={500} fontSize="fontSize">
          ACM Transactions on Graphics (Proceedings of SIGGRAPH 2023)
        </Box>
      </>
    );
    const neuralLodProject = (
      <ProjectCard
        image={require("../data/neural_lod/fractal_thumbnail.png")}
        title="Neural Prefiltering for Correlation-Aware Levels of Detail"
        subtitle={neuralLodSubtitle}
        description={neuralLodDescription}
        projectPageLink="./neural_lod"
      />
    );

    const nbvhDescription = (
      <>
        <Box fontWeight={500}>Abstract </Box>
        Neural representations have shown spectacular ability to compress complex signals in a fraction of the raw data size. In 3D computer graphics, the bulk of a scene's memory usage is due to polygons and textures, making them ideal candidates for neural compression. Here, the main challenge lies in finding good trade-offs between efficient compression and cheap inference while minimizing training time. In the context of rendering, we adopt a ray-centric approach to this problem and devise N-BVH, a neural compression architecture designed to answer arbitrary ray queries in 3D. Our compact model is learned from the input geometry and substituted for it whenever a ray intersection is queried by a path-tracing engine. While prior neural compression methods have focused on point queries, ours proposes neural ray queries that integrate seamlessly into standard ray-tracing pipelines. At the core of our method, we employ an adaptive BVH-driven probing scheme to optimize the parameters of a multi-resolution hash grid, focusing its neural capacity on the sparse 3D occupancy swept by the original surfaces. As a result, our N-BVH can serve accurate ray queries from a representation that is more than an order of magnitude more compact, providing faithful approximations of visibility, depth, and appearance attributes. The flexibility of our method allows us to combine and overlap neural and non-neural entities within the same 3D scene and extends to appearance level of detail.
      </>
    );
    const nbvhSubtitle = (
      <>
        <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Alexander Rath, Élie Michel, Iliyan Georgiev, Philipp Slusallek, Tamy Boubekeur, 2024
        <Box fontWeight={500} fontSize="fontSize">
          ACM SIGGRAPH 2024 (Conference Track)
        </Box>
      </>
    );
    const nbvhProject = (
      <ProjectCard
        image={require("../data/neural_bvh/teaser.png")}
        title="N-BVH: Neural ray queries with bounding volume hierarchies"
        subtitle={nbvhSubtitle}
        description={nbvhDescription}
        projectPageLink="./neural_bvh"
      />
    );

    const practicalReconstructionDescription = (
      <>
        <Box fontWeight={500}>Abstract </Box>
        Inverse rendering has emerged as a standard tool to reconstruct the parameters of appearance models from images (e.g., textured BSDFs). In this work, we present several novel contributions motivated by the practical challenges of recovering high-resolution surface appearance textures, including spatially-varying subsurface scattering parameters.
        <br />
        First, we propose Laplacian mipmapping, which combines differentiable mipmapping and a Laplacian pyramid representation into an effective preconditioner. This seemingly simple technique significantly improves the quality of recovered surface textures on a set of challenging inverse rendering problems. Our method automatically adapts to the render and texture resolutions, only incurs moderate computational cost and achieves better quality than prior work while using fewer hyperparameters. Second, we introduce a specialized gradient computation algorithm for textured, path-traced subsurface scattering, which facilitates faithful reconstruction of translucent materials. By using path tracing, we enable the recovery of complex appearance while avoiding the approximations of the previously used diffusion dipole methods. Third, we demonstrate the application of both these techniques to reconstructing the textured appearance of human faces from sparse captures. Our method recovers high-quality relightable appearance parameters that are compatible with current production renderers.
      </>
    );
    const practicalReconstructionSubtitle = (
      <>
        <Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Jérémy Riviere, Ruslan Guseinov, Stephan Garbin, Philipp Slusallek, Bernd Bickel, Thabo Beeler, Delio Vicini, 2025
        <Box fontWeight={500} fontSize="fontSize">
          ACM Transactions on Graphics (Proceedings of SIGGRAPH 2025)
        </Box>
      </>
    );
    const practicalReconstructionProject = (
      <ProjectCard
        image={require("../data/practical_reconstruction/teaser_small.png")}
        title="Practical Inverse Rendering of Textured and Translucent Appearance"
        subtitle={practicalReconstructionSubtitle}
        description={practicalReconstructionDescription}
        projectPageLink="./practical_reconstruction"
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

    const publications = [practicalReconstructionProject, nbvhProject, neuralLodProject, earsProject, opsrProject, layeredAnisoProject];
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
