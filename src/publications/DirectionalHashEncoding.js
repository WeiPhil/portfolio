import React from "react";
import { makeStyles, withStyles, useTheme } from "@mui/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Link, Button, Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DescriptionIcon from "@mui/icons-material/Description";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ReactComponent as ACMIcon } from './acm_icon.svg';

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
		paddingTop: '36.29%' /* image_h/ image_w = 773/2130 = 36.29% */
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
	icon: {
		marginRight: theme.spacing(1),
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

function DirectionalHashEncoding(props) {
	window.scrollTo(0, 0);

	const theme = useTheme();
	const classes = useStyles();

	const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

	const [paperLink, paperLinkLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/directional_hash_encoding.pdf",
		"Paper (49.2 MB)",
	];
	const [supplementalLink, supplementalLabel] = [
		"https://weiphil.s3.eu-central-1.amazonaws.com/directional_hash_encoding_supplemental.pdf",
		"Supplemental (14.8 MB)",
	];
	const [acmLink, acmLinkLabel] = [
		"https://doi.org/10.1145/3799902.3811182",
		"ACM Link",
	];
	const [githubLink, githubLabel] = [
		"https://github.com/facebookresearch/spatio_directional_hash_encoding",
		"Code",
	];

	const authorData = [
		{
			name: "Philippe Weier", affiliations: ["Meta, Switzerland", "Saarland University, Germany"]
		},
		{
			name: "Lukas Bode", affiliations: ["Meta, Switzerland"]
		},
		{
			name: <StyledLink href="https://graphics.cg.uni-saarland.de/people/slusallek.html">
				Philipp Slusallek
			</StyledLink>, affiliations: ["Saarland University, Germany"]
		},
		{
			name: <StyledLink href="https://scholar.google.com/citations?user=pXKBhbkAAAAJ&hl=en">
				Adrián Jarabo
			</StyledLink>, affiliations: ["Meta, Spain"]
		},
		{
			name: <StyledLink href="https://speierers.github.io/">
				Sébastien Speierer
			</StyledLink>, affiliations: ["Meta, Switzerland"]
		},
	];

	// no-useless-escape
	const directionalHashBibtex = `@inproceedings{Weier2026Beyond,
		author = {Weier, Philippe and Bode, Lukas and Slusallek, Philipp and Jarabo, Adri\\'{a}n and Speierer, S\\'{e}bastien},
		title = {Beyond Positional Encoding: A 5D Spatio-Directional Hash Encoding},
		booktitle = {ACM SIGGRAPH 2026 Conference Papers},
		year = {2026},
		url = {https://doi.org/10.1145/3799902.3811182},
		doi = {10.1145/3799902.3811182},
	}`;

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
								Beyond Positional Encoding: A 5D Spatio-Directional Hash Encoding
							</Box>
						</Typography>

						<AuthorBanner authorData={authorData} />

						<Typography gutterBottom style={{ textAlign: "center" }}>
							Published at <StyledLink href="https://s2026.siggraph.org/">
								SIGGRAPH 2026
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
								image={require("../data/directional_hash_encoding/teaser_large.png")}
								title="Spatio-Directional Hash Encoding Teaser"
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
										href={acmLink}
										disabled
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
									In this work, we propose a new spatio-directional neural encoding that is compact and efficient, and supports all-frequency signals in both space and direction. Current learnable encodings focus on Cartesian orthonormal spaces, which have been shown to be useful for representing high-frequency signals in the spatial domain. However, directly applying these encodings in the directional domain results in distortions, singularities, and discontinuities. As a result, most related works have used more traditional encodings for the directional domain, which lack the expressivity of learnable neural encodings. We address this by proposing a new angular encoding that generalizes the hash-grid approach from Müller et al. [2022] to the directional domain by encoding directions using a hierarchical geodesic grid. Each vertex in the geodesic grid stores a learnable latent parameter, which is used to feed a neural network. Armed with this directional encoding, we propose a five-dimensional encoding for spatio-directional signals. We demonstrate that both encodings significantly outperform other hash-based alternatives. We apply our five-dimensional encoding in the context of neural path guiding, outperforming the state of the art by up to a factor of 2 in terms of variance reduction for the same number of samples.
								</Typography>
							</Grid>

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
											"https://weiphil.s3.eu-central-1.amazonaws.com/directional_hash_encoding_supplemental_video.mp4"
										}
										controls={true}
									/>
								</Box>
							</Grid>

							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<BibtexEntry bibtexString={directionalHashBibtex} />
							</Grid>

							<Grid
								item
								style={smallWidth ? { marginTop: 20 } : { marginTop: 40 }}
							>
								<Typography variant="h5" gutterBottom>
									<Box fontWeight={500}>Acknowledgements</Box>
								</Typography>
								<Typography variant="body1" gutterBottom>
									The authors would like to thank Alexander Rath for his assistance
									and support with the implementation of his Neural Path Guiding
									framework. We also thank the various artists for the textures and
									scenes used in this paper, including Benedikt Bitterli, Wig42, Jay,
									and Piopis.
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
			<Footer />
		</Container>
	);
}

export default DirectionalHashEncoding;
