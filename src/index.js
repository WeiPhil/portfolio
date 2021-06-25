import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import Multilayered from './publications/Multilayered';
import MenuBar from './components/MenuBar'
import theme from './theme';
import { MuiThemeProvider } from 'material-ui/styles';
import { HashRouter as Router, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <MuiThemeProvider>
      <Router>
      <MenuBar />
        <Switch>
          <Route path="/publications/multilayered" component={Multilayered} />
          <Route exact path="/" component={App} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  </ThemeProvider>,
  document.querySelector('#root'),
);
