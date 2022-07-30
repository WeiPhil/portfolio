import React from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Grid, Link, Button, Box, Container } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DescriptionIcon from "@material-ui/icons/Description";
import SlideshowIcon from "@material-ui/icons/Slideshow";
import ReactPlayer from "react-player";

import Footer from "../components/Footer";
import OpenInBrowser from "@material-ui/icons/OpenInBrowser";

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
	button: {
		textTransform: "none",
		margin: theme.spacing(0.5),
	},
	figureLegend: {
		maxWidth: "70%",
		[theme.breakpoints.down("sm")]: {
			maxWidth: "100%",
		},
	},
}));

const StyledLink = withStyles((theme) => ({
	root: {
		"&:hover": {
			color: "#af7b6b",
		},
	},
}))((props) => <Link underline="none" {...props} />);

function Ears(props) {
	window.scrollTo(0, 0);

	const theme = useTheme();
	const classes = useStyles();

	const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

	const [paperLink, paperLinkLabel] = [
		"https://graphics.cg.uni-saarland.de/papers/rath-2022-ears.pdf",
		"Paper (30.7 MiB)",
	];
	const [supplementalLink, supplementalLabel] = [
		"https://graphics.cg.uni-saarland.de/papers/ears/",
		"Interactive Viewer",
	];
	const [presentationLink, presentationLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/opsr_egsr_presentation.pptx",
		"Presentation",
	];

	return (
		<Container className={classes.content}>
			<div className={classes.root}>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems={smallWidth ? "flex-start" : "center"}
				>
					<Grid item>
						<Typography variant="h5" gutterBottom>
							<Box fontWeight="fontWeightRegular">
								{" "}
								EARS: Efficiency-Aware Russian Roulette and Splitting
							</Box>
						</Typography>

						<Typography>
							Alexander Rath, Pascal Grittmann, Sebastian Herholz,
							{" "}<Box fontWeight={500} style={{ display: 'inline-block' }}>Philippe Weier</Box>, Philipp Slusallek, 2022
						</Typography>

						<Typography gutterBottom>
							Published in ACM Transactions on Graphics (Proceedings of{" "}
							<StyledLink href="https://s2022.siggraph.org/">
								SIGGRAPH 2022
							</StyledLink>
							)
						</Typography>

						<Card className={classes.card}>
							<CardMedia
								className={classes.image}
								image={require("../data/ears/ears_teaser.png")}
								title="EARS Teaser"
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
										<OpenInBrowser className={classes.icon} />
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
									Russian roulette and splitting are widely used techniques to increase the
									efficiency of Monte Carlo estimators. But, despite their popularity, there
									is little work on how to best apply them. Most existing approaches rely on
									simple heuristics based on, e.g., surface albedo and roughness. Their efficiency
									often hinges on user-controlled parameters. We instead iteratively learn optimal
									Russian roulette and splitting factors during rendering, using a simple and
									lightweight data structure. Given perfect estimates of variance and cost, our
									fixed-point iteration provably converges to the optimal Russian roulette and
									splitting factors that maximize the rendering efficiency. In our application
									to unidirectional path tracing, we achieve consistent and significant speed-ups
									over the state of the art.
								</Typography>
							</Grid>
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<ReactPlayer

									url={
										"https://www.youtube.com/watch?v=Fby_DTcbU0c&ab_channel=AlexanderRath"
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

export default Ears;
