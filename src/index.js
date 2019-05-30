import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import theme from './theme';
import { MuiThemeProvider } from 'material-ui/styles';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </ThemeProvider>,
  document.querySelector('#root'),
);
