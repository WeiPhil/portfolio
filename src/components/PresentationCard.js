import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Grid, Link, Button, Icon, SvgIcon } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const useStyles = makeStyles(theme => ({
  root: {
    padding: 50,
    paddingTop: 60,
    paddingBottom: 50,
    [theme.breakpoints.down('sm')]: {
      padding: 10,
    },
  },
  card: {
    marginTop: 15,
    height: 250,
    width: 180,
    [theme.breakpoints.down('sm')]: {
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
    margin: theme.spacing(2),
  },
}));

const StyledLink = withStyles(theme => ({
  root: {
    '&:hover': {
      color: "#af7b6b",
    },
  }
}))(props => <Link underline="none" {...props} />);

function GitHubIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
    </SvgIcon>
  );
}

function LinkedInIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> </SvgIcon>
  );
}

function PresentationCard(props) {
  const theme = useTheme();
  const classes = useStyles();

  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <Grid container direction={smallWidth ? "column" : "row"} alignItems={smallWidth ? "center" : "flex-start"} >
        {!smallWidth && <Grid item md={3}>
          <Card className={classes.card}>
            <CardMedia className={classes.image}
              image={require('../data/images/phil_picture.jpg')}
              title="My Picture"
            />
          </Card>
        </Grid>}

        <Grid item md={smallWidth ? true : 9}>
          <Grid container direction="column" alignItems="center">
            <Grid item style={{ paddingTop: smallWidth ? 15 : 5, }}>
              <Typography component={smallWidth ? "h2" : "h4"} variant={smallWidth ? "h3" : "h4"} align={smallWidth ? "center" : "inherit"} gutterBottom>
                Philippe Weier
                </Typography>

              {smallWidth &&
                <Card className={classes.card}>
                  <CardMedia className={classes.image}
                    image={require('../data/images/phil_picture.jpg')}
                    title="My Picture"
                  />
                </Card>}

              <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ marginTop: 30 }}>
                I am a Master student in Computer Science and Communication at <StyledLink target='_blank' href="https://www.epfl.ch/">EPFL</StyledLink> currently doing my Master Thesis at <StyledLink target='_blank' href="https://www.wetafx.co.nz/">Weta Digital</StyledLink> in rendering.
                  </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                My main research interests are physically-based rendering, signal processing and realtime rendering. In my free time when not programming some toy project I have many hobbies including playing the trumpet, painting miniatures, climbing and bicycle touring.
                  </Typography>
              <Typography variant="subtitle1" color="textSecondary" style={{ marginTop: 30 }}>
                Feel free to <StyledLink href="mailto:philippe.weier@epfl.ch">contact me</StyledLink> if you have any questions or simply want to chat.
                </Typography>

            </Grid>
            <Grid item>
              <Grid container direction="row" alignContent="center" style={{ marginTop: 40 }} justify="space-around">
                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={require('../data/resume.pdf')}><Icon className={classes.icon} >description</Icon>
                    CV
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href="https://github.com/WeiPhil"><GitHubIcon className={classes.icon} ></GitHubIcon>
                    Github
                </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href="https://ch.linkedin.com/in/philippe-weier-5125a2165"><LinkedInIcon className={classes.icon} ></LinkedInIcon>
                    LinkedIn
                </Button>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Grid>

      </Grid >
    </div >
  );

}

export default PresentationCard;