import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  card: {
    width: "100%",
    height: 300,

  },
  image: {
    height: "100%",
    width: "100%",
  },
}));

function ProjectCard(props) {
  const classes = useStyles();
  const image = props.image;
  const content = props.content;

  return (
    <Grid container direction="row" spacing={10}>
      <Grid item md={4}>

        <Card className={classes.card}>
          <CardMedia
            className={classes.image}
            image={image}
            title="Project Illustration"
          />
        </Card>
      </Grid>

      <Grid item md={8}>
        {content}
      </Grid>
    </Grid>
  );
}


export default ProjectCard;

