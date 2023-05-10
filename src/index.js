import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import Multilayered from "./publications/Multilayered";
import Opsr from "./publications/Opsr";
import Ears from "./publications/Ears";
import NeuralLod from "./publications/NeuralLod";
import MenuBar from "./components/MenuBar";
import theme from "./theme";
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


const reload = () => window.location.reload();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Router >
      <MenuBar />
      <Switch>
        <Route exact path="/publications/multilayered" component={Multilayered} />
        <Route exact path="/publications/opsr" component={Opsr} />
        <Route exact path="/publications/ears" component={Ears} />
        <Route exact path="/publications/neural_lod" component={NeuralLod} />
        <Route exact path="/portfolio" component={App} />
        <Route exact path="/portfolio/neural_lod_viewer" onEnter={reload} />
      </Switch>
    </Router>
  </ThemeProvider>,
  document.querySelector("#root")
);
