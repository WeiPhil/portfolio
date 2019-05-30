import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import ProjectsOverview from "./components/ProjectsOverview";
import { Container, Divider, Typography } from "@material-ui/core";
import PresentationCard from "./components/PresentationCard";


const styles = theme => ({
  content: {
    height: "100vh",
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[300],
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 1px",
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: "center"
  }
});


class App extends Component {
  state = {};



  render() {
    const { classes } = this.props;



    return (
      <Container maxWidth="lg" className={classes.content}>

        <PresentationCard></PresentationCard>
        <Divider />
        <ProjectsOverview />
        <Divider />
        <Typography className={classes.footer} variant="subtitle1" color="textSecondary" gutterBottom>
          © 2019 Philippe Weier
        </Typography>

      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
