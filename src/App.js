import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import ProjectsOverview from "./components/ProjectsOverview";
import { Container, Divider } from "@material-ui/core";
import PresentationCard from "./components/PresentationCard";
import Footer from "./components/Footer";


const styles = theme => ({
  content: {
    height: "100%",
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[300],
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 1px",
  },
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
        <Footer />

      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
