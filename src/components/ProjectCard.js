import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Grid, Button, SvgIcon, Icon, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    width: "100%",
    height: 300,
    [theme.breakpoints.down('xs')]: {
      height: 160,
    },

  },
  image: {
    height: "100%",
    width: "100%",
  },
  button: {
    textTransform: "none",
  },
}));

function GitHubIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
    </SvgIcon>
  );
}

function ProjectCard(props) {
  const theme = useTheme();
  const classes = useStyles();


  const { image, title, subtitle, description, githubLink, projectPageLink } = props;

  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container direction={mobile ? "column" : "row"} justify="space-between">
      <Grid item xs={mobile ? true : 4}>

        <Card className={classes.card}>
          <CardMedia
            className={classes.image}
            image={image}
            title="Project Illustration"
          />
        </Card>
      </Grid>


      <Grid item xs={mobile ? true : 7}>
        <Grid container direction="column" style={{ marginTop: mobile && 20 }}>

          <Grid item>
            <Typography component="h5" variant="h5" gutterBottom>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              <i>{subtitle}</i>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Grid>

          <Grid container direction="row" alignContent="flex-start" justify="flex-start" style={{ marginTop: mobile ? 20 : 40 }}>
            <Grid item style={{ marginLeft: 10 }}>
              {githubLink !== "" && <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={githubLink}><GitHubIcon className={classes.icon} ></GitHubIcon>
                Github
                </Button>}
            </Grid>
            <Grid item style={{ marginLeft: 10 }}>



              {projectPageLink !== "" && <Button variant="outlined" color="secondary" className={classes.button} target="_blank" href={projectPageLink}><Icon className={classes.icon} >folder</Icon>
                Project Page
                </Button>}

            </Grid>
          </Grid>

        </Grid>

      </Grid>
    </Grid>
  );

}

ProjectCard.propTypes = {
  githubLink: PropTypes.string,
  projectPageLink: PropTypes.string,
};

ProjectCard.defaultProps = {
  githubLink: "",
  projectPageLink: "",
};


// export default withStyles(styles, { withTheme: true })(ProjectCard);


// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
// import { Grid } from '@material-ui/core';


// const useStyles = makeStyles(theme => ({
//   card: {
//     width: "100%",
//     height: 300,

//   },
//   image: {
//     height: "100%",
//     width: "100%",
//   },
// }));

// function ProjectCard(props) {
//   const classes = useStyles();
//   const image = props.image;
//   const content = props.content;

//   return (
//     <Grid container direction="row" spacing={10}>
//       <Grid item md={4}>

//         <Card className={classes.card}>
//           <CardMedia
//             className={classes.image}
//             image={image}
//             title="Project Illustration"
//           />
//         </Card>
//       </Grid>

//       <Grid item md={8}>
//         {content}
//       </Grid>
//     </Grid>
//   );
// }


export default ProjectCard;

