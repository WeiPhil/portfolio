import React from "react";
import { makeStyles, withStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Link, Button, Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DescriptionIcon from "@mui/icons-material/Description";
import GitHubIcon from "@mui/icons-material/GitHub";
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
		paddingTop: '44.41%', /* image_h/ image_w */
		// paddingTop: '61.59%' /* image_h/ image_w */
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

function NeuralLod(props) {
	window.scrollTo(0, 0);

	const theme = useTheme();
	const classes = useStyles();

	const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

	const [paperLink, paperLinkLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod.pdf",
		"Paper (18.3 MB)",
	];
	// const [supplementalViewerLink, supplementalViewerLabel] = [
	// 	"",
	// 	"Interactive Viewer",
	// ];
	const [supplementalLink, supplementalLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_supplemental.pdf",
		"Supplemental (5.3 MB)",
	];
	// const [presentationLink, presentationLabel] = [
	// 	"https://weiphil.s3.eu-central-1.amazonaws.com/opsr_egsr_presentation.pptx",
	// 	"Presentation",
	// ];
	const [githubLink, githubLabel] = [
		"https://github.com/WeiPhil/neural_lod",
		"Code (Coming Soon)",
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
								Neural Prefiltering for Correlation-Aware Levels of Detail
							</Box>
						</Typography>

						<Typography style={{ textAlign: "center" }}>
							<Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Tobias Zirr, Anton Kaplanyan, Ling-Qi Yan, Philipp Slusallek, 2023
						</Typography>

						<Typography gutterBottom style={{ textAlign: "center" }}>
							Published in ACM Transactions on Graphics (Proceedings of{" "}
							<StyledLink href="https://s2023.siggraph.org/">
								SIGGRAPH 2023
							</StyledLink>
							)
						</Typography>

						<Card className={classes.card}
							variant="outlined"
							sx={{
								bgcolor: 'rgba(0, 0, 0, 0)',
								borderRadius: 0,
								borderColor: 'rgba(0, 0, 0, 0)',
							}}>
							<CardMedia
								className={classes.image}

								image={require("../data/neural_lod/neural_lod_teaser.png")}
								title="Neural Lod Teaser"
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
									We introduce a practical general-purpose neural appearance filtering pipeline for physically-based rendering.
									We tackle the previously difficult challenge of aggregating visibility across many levels of detail from local information only, without relying on learning visibility for the entire scene. The high adaptivity of neural representations allows us to retain geometric correlations along rays and thus avoid light leaks.
									Common approaches to prefiltering decompose the appearance of a scene into volumetric representations with physically-motivated parameters, where the inflexibility of the fitted models limits rendering accuracy.
									We avoid assumptions on particular types of geometry or materials, bypassing any special-case decompositions. Instead, we directly learn a compressed representation of the intra-voxel light transport. For such high-dimensional functions, neural networks have proven to be useful representations.
									To satisfy the opposing constraints of prefiltered appearance and correlation-preserving point-to-point visibility, we use two small independent networks on a sparse multi-level voxel grid.
									Each network requires 10-20 minutes of training to learn the appearance of an asset across levels of detail. Our method achieves 70-95% compression ratios and around 25% of quality improvements over previous work. We reach interactive to real-time framerates, depending on the level of detail.
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
										"https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_supplemental_video.mp4"
									}
									controls={true}
								/>
							</Box>
						</Grid>
					</Grid>
				</Grid>
			</div>
			<Footer />
		</Container>
	);
}

export default NeuralLod;
