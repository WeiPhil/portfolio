import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import ProjectsPage from './ProjectsPage';
import MenuBar from './components/MenuBar'
import theme from './theme';
import { MuiThemeProvider } from 'material-ui/styles';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <MuiThemeProvider>
      <MenuBar />
      <Router>
        <Switch>
          <Route exact path={process.env.PUBLIC_URL + "/projects/:projectpage"} component={ProjectsPage} />
          <Route exact path={process.env.PUBLIC_URL + "/"} component={App} />
          <Redirect to={process.env.PUBLIC_URL + "/"} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  </ThemeProvider>,
  document.querySelector('#root'),
);
