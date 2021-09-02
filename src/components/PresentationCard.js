import React from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Grid, Link, Button, Icon } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 50,
    paddingTop: 60,
    paddingBottom: 50,
    [theme.breakpoints.down("sm")]: {
      padding: 10,
    },
  },
  card: {
    marginTop: 15,
    height: 250,
    width: 180,
    [theme.breakpoints.down("sm")]: {
      height: 200,
      width: 160,
      margin: "0 auto",
      marginTop: 30,
    },
  },
  image: {
    height: "100%",
    maxWidth: "100%",
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  button: {
    textTransform: "none",
    marginTop: theme.spacing(3),
  },
}));

const StyledLink = withStyles((theme) => ({
  root: {
    "&:hover": {
      color: "#af7b6b",
    },
  },
}))((props) => <Link underline="none" {...props} />);

function PresentationCard(props) {
  const theme = useTheme();
  const classes = useStyles();

  const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className={classes.root}>
      <Grid
        container
        direction={smallWidth ? "column" : "row"}
        alignItems={smallWidth ? "center" : "flex-start"}
      >
        {!smallWidth && (
          <Grid item md={3}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.image}
                image={require("../data/images/phil_picture.jpg")}
                title="My Picture"
              />
            </Card>
          </Grid>
        )}

        <Grid item md={smallWidth ? true : 9}>
          <Grid container direction="column" alignItems="center">
            <Grid item style={{ paddingTop: smallWidth ? 15 : 5 }}>
              <Typography
                component={smallWidth ? "h2" : "h4"}
                variant={smallWidth ? "h3" : "h4"}
                align={smallWidth ? "center" : "inherit"}
                gutterBottom
              >
                Philippe Weier
              </Typography>

              {smallWidth && (
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.image}
                    image={require("../data/images/phil_picture.jpg")}
                    title="My Picture"
                  />
                </Card>
              )}

              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
                style={{ marginTop: 30 }}
              >
                I recently finished my Master in Computer Science and
                Communication at{" "}
                <StyledLink target="_blank" href="https://www.epfl.ch/">
                  EPFL
                </StyledLink>{" "}
                and currently working on Light Transport at{" "}
                <StyledLink target="_blank" href="https://www.wetafx.co.nz/">
                  Weta Digital
                </StyledLink>{" "}
                as a rendering researcher.
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                My main research interests are physically-based rendering,
                signal processing and real-time rendering. In my free time, when
                not programming some toy project, I like to play all sorts of
                instruments, including the Euphonium, the trumpet and the
                saxophone. You might also see me paint miniatures, climbing
                walls or cycling :)
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ marginTop: 30 }}
              >
                Feel free to{" "}
                <StyledLink href="mailto:ph.weier@gmail.com">
                  contact me
                </StyledLink>{" "}
                if you have any questions or simply want to chat.
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              target="_blank"
              href={require("../data/resume.pdf")}
            >
              <Icon className={classes.icon}>description</Icon>
              CV
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default PresentationCard;
