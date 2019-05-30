import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import SwipeableViews from 'react-swipeable-views';
import { Typography, Grid, withStyles, Link, Button, Icon } from '@material-ui/core';
import ProjectCard from './ProjectCard';
import { SvgIcon } from 'material-ui';

const StyledTabs = withStyles(theme => ({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > div': {
            maxWidth: 80,
            width: '100%',
            backgroundColor: theme.palette.primary.main,
        },
    },
}))(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const styles = theme => ({
    content: {
        margin: 40,
        height: "100%",
    },
    tabView: {
        marginTop: 50,
        height: "100%",
    },
    tab: {
        textTransform: 'none',
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        color: '#757575',
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    button: {
        textTransform: "none",
        margin: theme.spacing(2),
    },
});

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

class Navigation extends Component {
    state = {
        tabValue: 0,
    };

    handleTabChange = (event, tabValue) => {
        this.setState({ tabValue });
    };


    render() {

        const { classes } = this.props;

        const qulkanProject = <>
            <Grid container direction="column">
                <Grid item>
                    <Typography component="h5" variant="h5" gutterBottom>
                        Qulkan
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        A GPU Oriented Prototyping tool
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Qulkan is a personal project designed to give a quick start to anyone considering using openGL or Vulkan as a graphical API.
                        It has been designed to offer a simple interface for more complex software or research validation tools.
                    </Typography>
                </Grid>
                <Grid container direction="row" alignContent="flex-start" style={{ marginTop: 40 }} spacing={2}>
                    <Grid item>
                        <Button variant="outlined" color="secondary" className={classes.button}><Icon className={classes.icon} >folder</Icon>
                            Project Page
                  </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" className={classes.button}><GitHubIcon className={classes.icon} color="primary" ></GitHubIcon>
                            Github
                         </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>

        const lotrProject = <>
            <Typography component="h5" variant="h5" gutterBottom>
                Lotr Army Companion App
        </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Lord of the Ring: An unofficial companion App for your armies
        </Typography>
            <Typography variant="body2" color="textSecondary">
                The Lotr Army Companion App is a full-stack Web Application created in React. It has been created for the table-top
                game <StyledLink href="https://www.games-workshop.com/en-EU/Middle-earth">Middle-Earth Strategy Battle Game</StyledLink> and its unoficial
                extension Battle Companies. It serves as a database and an interactive army creation helper.
        </Typography>
        </>

        return (
            <div className={classes.content}>
                <StyledTabs variant="fullWidth" value={this.state.tabValue} onChange={this.handleTabChange} >
                    <Tab disableRipple className={classes.tab} label="Course Projects" />
                    <Tab disableRipple className={classes.tab} label="Research Projects" />
                    <Tab disableRipple className={classes.tab} label="Personal Projects" />
                </StyledTabs>
                {/* <SwipeableViews  className={classes.tabView} index={this.state.tabValue} onChangeIndex={this.handleTabChange}> */}

                <div className={classes.tabView}>
                    {this.state.tabValue === 0 &&

                        <Grid container direction="column" spacing={10}>
                            <Grid item>
                                <ProjectCard image={require('../data/images/lotrScreenshot.png')} content={lotrProject}></ProjectCard>
                            </Grid>
                            <Grid item>
                                <ProjectCard image={require('../data/images/qulkanScreenshot.png')} content={qulkanProject}></ProjectCard>
                            </Grid>
                        </Grid >

                    }
                    {this.state.tabValue === 1 &&
                        <Grid container direction="column" spacing={10}>
                            <Grid item>
                                <ProjectCard image={require('../data/images/lotrScreenshot.png')} content={lotrProject}></ProjectCard>
                            </Grid>
                            <Grid item>
                                <ProjectCard image={require('../data/images/qulkanScreenshot.png')} content={qulkanProject}></ProjectCard>
                            </Grid>
                        </Grid >
                    }
                    {this.state.tabValue === 2 &&
                        <Grid container direction="column" spacing={10}>
                            <Grid item>
                                <ProjectCard image={require('../data/images/lotrScreenshot.png')} content={lotrProject}></ProjectCard>
                            </Grid>
                            <Grid item>
                                <ProjectCard image={require('../data/images/qulkanScreenshot.png')} content={qulkanProject}></ProjectCard>
                            </Grid>
                        </Grid >
                    }

                    {/* </SwipeableViews> */}
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Navigation);