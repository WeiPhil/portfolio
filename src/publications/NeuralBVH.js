import React from "react";
import { makeStyles, withStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Link, Button, Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DescriptionIcon from "@mui/icons-material/Description";
import GitHubIcon from "@mui/icons-material/GitHub";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import OpenInBrowser from "@mui/icons-material/OpenInBrowser";
import ReactPlayer from "react-player";

import Footer from "../components/Footer";

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
			paddingLeft: 100,
			paddingRight: 100,
		},
	},
	card: {
		marginTop: 30,
		width: "100%",
	},
	image: {
		boxShadow: 0,
		height: 0,
		// paddingTop: '44.41%', /* image_h/ image_w */
		paddingTop: '42.579750346%' /* image_h/ image_w */
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

function NeuralBVH(props) {
	window.scrollTo(0, 0);

	const theme = useTheme();
	const classes = useStyles();

	const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

	const [paperLink, paperLinkLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/neural_bvh.pdf",
		"Paper (13.2 MB)",
	];
	const [supplementalViewerLink, supplementalViewerLabel] = [
		"./neural_bvh_viewer/",
		"Interactive Viewer",
	];
	const [supplementalLink, supplementalLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/neural_bvh_supplemental.pdf",
		"Supplemental (7.1 MB)",
	];
	// const [presentationLink, presentationLabel] = [
	// 	"https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_presentation.pptx",
	// 	"Presentation (with Speaker Notes)",
	// ];
	const [githubLink, githubLabel] = [
		"https://github.com/WeiPhil/nbvh",
		"Code",
	];

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
								N-BVH: Neural ray queries with bounding volume hierarchies
							</Box>
						</Typography>

						<Typography style={{ textAlign: "center" }}>
							<Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Alexander Rath, Élie Michel, Iliyan Georgiev, Philipp Slusallek, Tamy Boubekeur, 2024
						</Typography>

						<Typography gutterBottom style={{ textAlign: "center" }}>
							Published at <StyledLink href="https://s2024.siggraph.org/">
								SIGGRAPH 2024
							</StyledLink> (Conference Track)

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

								image={require("../data/neural_bvh/teaser_large.png")}
								title="Neural BVH Teaser"
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


							</Grid>

							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h6" gutterBottom>
									<Box fontWeight={500}>Abstract</Box>
								</Typography>
								<Typography variant="body1" gutterBottom>
									Neural representations have shown spectacular ability to compress complex signals in a fraction of the raw data size. In 3D computer graphics, the bulk of a scene's memory usage is due to polygons and textures, making them ideal candidates for neural compression. Here, the main challenge lies in finding good trade-offs between efficient compression and cheap inference while minimizing training time. In the context of rendering, we adopt a ray-centric approach to this problem and devise N-BVH, a neural compression architecture designed to answer arbitrary ray queries in 3D. Our compact model is learned from the input geometry and substituted for it whenever a ray intersection is queried by a path-tracing engine. While prior neural compression methods have focused on point queries, ours proposes neural ray queries that integrate seamlessly into standard ray-tracing pipelines. At the core of our method, we employ an adaptive BVH-driven probing scheme to optimize the parameters of a multi-resolution hash grid, focusing its neural capacity on the sparse 3D occupancy swept by the original surfaces. As a result, our N-BVH can serve accurate ray queries from a representation that is more than an order of magnitude more compact, providing faithful approximations of visibility, depth, and appearance attributes. The flexibility of our method allows us to combine and overlap neural and non-neural entities within the same 3D scene and extends to appearance level of detail.
								</Typography>
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
											"https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_fast_forward.mp4"
										}
										controls={true}
									/>
								</Box>
							</Grid> */}
							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Supplemental Video</Box>
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
											"https://weiphil.s3.eu-central-1.amazonaws.com/neural_bvh_supplemental_video.mp4"
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

export default NeuralBVH;
