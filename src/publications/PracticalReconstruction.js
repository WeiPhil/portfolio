import { useRef } from 'react';
import { makeStyles, withStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Link, Button, Box, Container, CardContent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DescriptionIcon from "@mui/icons-material/Description";
import GitHubIcon from "@mui/icons-material/GitHub";
// import SlideshowIcon from "@mui/icons-material/Slideshow";
import { ReactComponent as ACMIcon } from './acm_icon.svg';

import OpenInBrowser from "@mui/icons-material/OpenInBrowser";
import ReactPlayer from "react-player";

import Footer from "../components/Footer";
import AuthorBanner from "../components/AuthorBanner";
import VideocamIcon from '@mui/icons-material/Videocam';

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
		[theme.breakpoints.down("md")]: {
			paddingTop: 30,
			padding: 20,
		},
		[theme.breakpoints.up("md")]: {
			paddingLeft: 10,
			paddingRight: 10,
		},
	},
	card: {
		marginTop: 30,
		width: "100%",
	},
	image: {
		boxShadow: 0,
		height: 0,
		paddingTop: '42.174940898%' /* image_h/ image_w */
	},
	imageFigure: {
		boxShadow: 0,
		height: 0,
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
	reactCardMediaPlayer: {
		// position: 'absolute',
		// top: 0,
		// left: 0,
		// width: "100%",
		// height: "100%",
	},
	laplacianPyramid: {
		marginTop: 30,
		padding: "0.1em",
		paddingTop: "0.5em",
		width: 500,
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			height: "100%",
		},
	},
	comparisonChang: {
		padding: "0.5em",
		paddingTop: "0.5em",
		width: 500,
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			height: "100%",
		},
	},
	pathVsDipole: {
		marginTop: 30,
		padding: "0.1em",
		paddingTop: "0.5em",
		width: 500,
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			height: "100%",
		},
	},
	dengComparison: {
		marginTop: 30,
		padding: "0.1em",
		paddingTop: "0.5em",
		width: 500,
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			height: "100%",
		},
	},
	videoCard: {
		margin: 0,
		padding: 0,
		paddingBottom: 0,
		// padding: "0.1em",
		// paddingTop: "0.5em",
		width: 500,
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			height: "100%",
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

function PracticalReconstruction(props) {
	window.scrollTo(0, 0);

	const theme = useTheme();
	const classes = useStyles();

	const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

	const [paperLink, paperLinkLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction.pdf",
		"Paper (40.6 MB)",
	];
	const [paperLinkLowRes, paperLinkLabelLowRes] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_low_res.pdf",
		"Paper (low-res, 12.8 MB)",
	];
	const [supplementalViewerLink, supplementalViewerLabel] = [
		"./practical_reconstruction_viewer/",
		"Interactive Viewer",
	];
	const [supplementalLink, supplementalLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_supplemental.pdf",
		"Supplemental (31.2 MB)",
	];
	const supplementalVideoLabel = "Supplemental Video";

	const [acmLink, acmLinkLabel] = [
		"https://dl.acm.org/doi/10.1145/3730855",
		"ACM Link",
	];
	// const [presentationLink, presentationLabel] = [
	// 	"https://weiphil.s3.eu-central-1.amazonaws.com/nbvh_presentation.pptx",
	// 	"Presentation (with Speaker Notes)",
	// ];
	const [githubLink, githubLabel] = [
		"https://github.com/WeiPhil/practical_reconstruction",
		"Code (soon available)",
	];

	const authorData = [
		{
			name: "Philippe Weier", affiliations: ["Google", "Saarland University"]
		},
		{
			name: <StyledLink href="https://scholar.google.com/citations?user=FaLQzRAAAAAJ&hl=en">
				Jérémy Riviere
			</StyledLink>, affiliations: ["Google"]
		},
		{
			name: <StyledLink href="https://ruslanguseinov.com/">
				Ruslan Guseinov
			</StyledLink>, affiliations: ["Google"]
		},
		{
			name: <StyledLink href="http://stephangarbin.com/">
				Stephan Garbin
			</StyledLink>, affiliations: ["Google"]
		},
		{
			name: <StyledLink href="https://graphics.cg.uni-saarland.de/people/slusallek.html">
				Philipp Slusallek
			</StyledLink>, affiliations: ["DFKI", "Saarland University"]
		},
		{
			name: <StyledLink href="https://berndbickel.com/">
				Bernd Bickel
			</StyledLink>, affiliations: ["Google"]
		},
		{
			name: <StyledLink href="https://thabobeeler.com/">
				Thabo Beeler
			</StyledLink>, affiliations: ["Google"]
		},
		{
			name: <StyledLink href="https://dvicini.github.io/">
				Delio Vicini
			</StyledLink>, affiliations: ["Google"]
		},
	]

	const supplementalVideoRef = useRef(null);

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
								Practical Inverse Rendering of Textured and Translucent Appearance
							</Box>
						</Typography>

						<AuthorBanner authorData={authorData} />

						<Typography gutterBottom style={{ textAlign: "center" }}>
							Published in ACM Transactions on Graphics (Proceedings of <StyledLink href="https://s2025.siggraph.org/">SIGGRAPH 2025</StyledLink>)
						</Typography>

						<Card className={classes.card}
							variant="outlined"
							sx={{
								bgcolor: 'rgba(0, 0, 0, 0)',
								borderRadius: 0,
								borderColor: 'rgba(0,0,0,0)',
								borderWidth: 0,
							}}
						>
							<CardMedia
								className={classes.image}

								image={require("../data/practical_reconstruction/teaser.png")}
								title="Practical Reconstruction Teaser"
							/>
						</Card>

						<Grid item style={{ marginTop: 30 }} >
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
										disabled="True"
									>
										<GitHubIcon className={classes.icon} />
										{githubLabel}
									</Button>
								</Grid>

								<Grid item>
									<Button
										variant="outlined"
										color="secondary"
										className={classes.button}
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
										href={paperLinkLowRes}
									>
										<DescriptionIcon className={classes.icon} />
										{paperLinkLabelLowRes}
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
										<DescriptionIcon className={classes.icon} />
										{supplementalLabel}
									</Button>
								</Grid>

								<Grid item>
									<Button
										variant="outlined"
										color="secondary"
										className={classes.button}
										onClick={() => supplementalVideoRef.current?.scrollIntoView()}
									>
										<VideocamIcon className={classes.icon} />
										{supplementalVideoLabel}
									</Button>
								</Grid>

								<Grid item>
									<Button
										variant="outlined"
										color="secondary"
										className={classes.button}
										target="_blank"
										href={supplementalViewerLink}
									>
										<OpenInBrowser className={classes.icon} />
										{supplementalViewerLabel}
									</Button>
								</Grid>
								{/* <Grid item>
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
								</Grid> */}

								<Grid item>
									<Button
										variant="outlined"
										color="secondary"
										className={classes.button}
										target="_blank"
										href={acmLink}
										disabled="True"
									>
										<ACMIcon className={classes.icon} fill='#585858' height='1.5rem' />
										{acmLinkLabel}
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
									Inverse rendering has emerged as a standard tool to reconstruct the parameters of appearance models from images (e.g., textured BSDFs). In this work, we present several novel contributions motivated by the practical challenges of recovering high-resolution surface appearance textures, including spatially-varying subsurface scattering parameters.
									<br />
									First, we propose Laplacian mipmapping, which combines differentiable mipmapping and a Laplacian pyramid representation into an effective preconditioner. This seemingly simple technique significantly improves the quality of recovered surface textures on a set of challenging inverse rendering problems. Our method automatically adapts to the render and texture resolutions, only incurs moderate computational cost and achieves better quality than prior work while using fewer hyperparameters. Second, we introduce a specialized gradient computation algorithm for textured, path-traced subsurface scattering, which facilitates faithful reconstruction of translucent materials. By using path tracing, we enable the recovery of complex appearance while avoiding the approximations of the previously used diffusion dipole methods. Third, we demonstrate the application of both these techniques to reconstructing the textured appearance of human faces from sparse captures. Our method recovers high-quality relightable appearance parameters that are compatible with current production renderers.
								</Typography>
							</Grid>
							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Laplacian mipmapping</Box>
								</Typography>
								<Typography variant="body1" gutterBottom>
									We propose Laplacian mipmapping, a novel preconditioning technique that synergizes differentiable mipmapping with a Laplacian pyramid representation. This approach markedly improves the quality and robustness of recovered surface textures, particularly in complex inverse rendering scenarios. It offers the advantages of automatically adapting to different render and texture resolutions, incurring only moderate computational overhead, and proving less sensitive to hyperparameter adjustments compared to previous methods.

									Be sure to also check out our <StyledLink href={supplementalViewerLink}>supplemental viewer</StyledLink> where you can interactively compare different scenes against previous work!
								</Typography>


								<Grid
									container
									direction={"row"}
									justifyContent="center"
									alignItems="center"
									spacing={5}
								>
									<Grid item>
										<Card
											className={classes.laplacianPyramid}
										>
											<CardMedia
												className={classes.imageFigure}
												image={require("../data/practical_reconstruction/laplacian_pyramid.png")}
												title="laplacian_pyramid"
												sx={{ paddingTop: '72.7810650888%' }}
											/>
											<CardContent>
												<i>
													We construct a texture's mipmap hierarchy from a Laplacian pyramid. A texture lookup during rendering thus accumulates information from alllevels in the Laplacian pyramidbelowthe queried mipmap level (red).
												</i>
											</CardContent>
										</Card>
									</Grid>
									<Grid item>
										<Card
											className={classes.comparisonChang}
										>
											<CardMedia
												className={classes.imageFigure}
												image={require("../data/practical_reconstruction/gradient_filtering_limitation.png")}
												title="gradient_filtering_limitation"
												sx={{ paddingTop: '76.1811023622%' }}
											/>
											<CardContent>
												<i>
													Comparison  of  our  method  to  cross-bilateral  gradient  filtering [Chang et al. 2024] on a scene where a 4096<sup>2</sup> texture is simultaneously optimized for a close-up (top row) and a wide-angle view (bottom row), each rendered at 1024<sup>2</sup>. We find the optimal learning rate (lr) and cross-bilateral filter weight 𝜎 using a grid search. We do this for both views at the sametime ("Opt. combined"), as well as for each view individually ("Opt. close" and "Opt. far"). The optimal parameters for one view do not generalize to theother, and even the best combined filter bandwidth 𝜎 cannot simultaneously handle both views.
												</i>
											</CardContent>
										</Card>
									</Grid>

								</Grid>

							</Grid>
							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Differentiable subsurface scattering</Box>
								</Typography>
								<Typography variant="body1" gutterBottom>
									Our work introduces a specialized gradient computation algorithm designed for efficient, textured, path-traced subsurface scattering. This enables the faithful and accurate reconstruction of translucent materials. By employing path tracing, our method overcomes the approximations inherent in prior diffusion dipole techniques, allowing for the recovery of intricate appearance details that were previously challenging to capture.
								</Typography>

								<Grid
									container
									direction={"row"}
									justifyContent="center"
									alignItems="center"
									spacing={5}
								>
									<Grid item>
										<Card
											className={classes.pathVsDipole}
										>
											<CardMedia
												className={classes.imageFigure}
												image={require("../data/practical_reconstruction/subsurface_vs_dipole.png")}
												title="subsurface_vs_dipole"
												sx={{ paddingTop: '37.5247524752%' }}
											/>
											<CardContent>
												<i>
													<b>Left:</b> Path-traced subsurface scattering estimates outgoing radianceby sampling a light path through the object's interior. The medium parameters are set by evaluating 2D textures at the point of entry. <b>Right:</b> An alternative, approximate solution are diffusion dipole models [Jensen et al. 2001], which directly sample outgoing surface locations according to a two-dimensional scattering profile [King et al. 2013].
												</i>
											</CardContent>
										</Card>
									</Grid>
									<Grid item>
										<Card
											className={classes.dengComparison}
										>
											<CardMedia
												className={classes.imageFigure}
												image={require("../data/practical_reconstruction/deng_comparison.png")}
												title="deng_comparison"
												sx={{ paddingTop: '81.1023622047%' }}
											/>
											<CardContent>
												<i>
													Comparison of our method and the differentiable diffusion dipolemodel [Deng et al. 2022].
												</i>
											</CardContent>
										</Card>
									</Grid>

								</Grid>
							</Grid>

							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Facial appearance reconstruction</Box>
								</Typography>
								<Typography variant="body1" gutterBottom>
									We apply the aforementioned techniques to the task of reconstructing human facial appearance from sparse multi-view captures, where each capture uses a different point light to illuminate the subject. This combined approach allows for the recovery of high-quality, relightable appearance parameters for skin that are compatible with standard production renderers. The method utilizes differentiable path tracing to optimize the parameters of established rendering models for human skin.
								</Typography>

								<Grid
									container
									direction={"row"}
									justifyContent="center"
									alignItems="center"
									spacing={5}
									style={smallWidth ? { marginTop: 10 } : { marginTop: 20 }}
								>
									<Grid item>
										<Card
											className={classes.videoCard}
										>
											<ReactPlayer
												className={classes.reactCardMediaPlayer}
												width='100%'
												height='100%'
												url={
													require("../data/practical_reconstruction/face_optim.mp4")
												}
												muted={true}
												controls={false}
												loop={true}
												playing={true}
											/>
											<CardContent>
												<i>
													Subsurface scattering parameter optimization is performed in two steps. First, we optimize the parameters of a principled BSDF. The base color of the principled BSDF is then converted to single scattering albedo, which is further optimized along with the textured extinction and phase function parameters.
												</i>
											</CardContent>
										</Card>
									</Grid>

									<Grid item>
										<Card
											className={classes.videoCard}
										>
											<ReactPlayer
												className={classes.reactCardMediaPlayer}
												width='100%'
												height='100%'
												url={
													require("../data/practical_reconstruction/light_anim.mp4")
												}
												muted={true}
												controls={false}
												loop={true}
												playing={true}
											/>
											<CardContent>
												<i>
													Once the model is trained we can easily relight the model under a moving point light.
												</i>
											</CardContent>
										</Card>
									</Grid>

									<Grid item>
										<Card
											className={classes.videoCard}
										>
											<ReactPlayer
												className={classes.reactCardMediaPlayer}
												width='100%'
												height='100%'
												url={
													require("../data/practical_reconstruction/light_anim_close.mp4")
												}
												muted={true}
												controls={false}
												loop={true}
												playing={true}
											/>
											<CardContent>
												<i>
													Our Laplacian mipmapping allows high-frequency detail, such as glints, to be recovered — a previously challenging task in facial appearance recovery.
												</i>
											</CardContent>
										</Card>
									</Grid>

									<Grid item>
										<Card
											className={classes.videoCard}
										>
											<ReactPlayer
												className={classes.reactCardMediaPlayer}
												width='100%'
												height='100%'
												url={
													require("../data/practical_reconstruction/light_anim_envmap.mp4")
												}
												muted={true}
												controls={false}
												loop={true}
												playing={true}
											/>
											<CardContent>
												<i>
													Although the dataset contains only point light sources, the model can be relit under different environment maps, since the optimized textures are independent of the lighting used during re-rendering.
												</i>
											</CardContent>
										</Card>
									</Grid>

									<Grid item>
										<Card
											className={classes.videoCard}
										>
											<ReactPlayer
												className={classes.reactCardMediaPlayer}
												width='100%'
												height='100%'
												url={
													require("../data/practical_reconstruction/camera_anim.mp4")
												}
												muted={true}
												controls={false}
												loop={true}
												playing={true}
											/>
											<CardContent>
												<i>
													Similarly, we can re-render from novel camera views, even though our initial dataset is sparse.
												</i>
											</CardContent>
										</Card>
									</Grid>

								</Grid>

							</Grid>
							{/* <Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Fast Forward Video</Box>
								</Typography>
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
											"https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_fast_forward.mp4"
										}
										controls={true}
									/>
								</Box>
							</Grid> */}
							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
								ref={supplementalVideoRef}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Supplemental video</Box>
								</Typography>
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
											"https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_supplemental_video.mp4"
										}
										controls={true}
									/>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
			<Footer />
		</Container>
	);
}

export default PracticalReconstruction;
