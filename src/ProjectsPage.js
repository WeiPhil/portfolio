import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import Footer from "./components/Footer";
import Multilayered from "./projects/multilayered";


const styles = theme => ({
  content: {
    height: "100%",
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[300],
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 1px",
    maxWidth: "xl",
  },
});


class ProjectsPage extends Component {
  state = {};



  render() {
    const { classes } = this.props;

    const projectPage = this.props.match.params.projectpage;


    const multilayeredProject = <Multilayered />

    const noProject = <Typography className={classes.footer} variant="subtitle1" color="textSecondary" gutterBottom>
      Page Unavailable
    </Typography>;


    var activeprojectpage;
    switch (projectPage) {
      case "multilayered":
        activeprojectpage = multilayeredProject;
        break;
      default:
        activeprojectpage = noProject;
    }



    return (
      <Container className={classes.content}>

        {activeprojectpage}

        <Footer />

      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ProjectsPage);
