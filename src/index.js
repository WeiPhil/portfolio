import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import Multilayered from "./publications/Multilayered";
import Opsr from "./publications/Opsr";
import Ears from "./publications/Ears";
import NeuralLod from "./publications/NeuralLod";
import NeuralBVH from "./publications/NeuralBVH";
import MenuBar from "./components/MenuBar";
import theme from "./theme";
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PracticalReconstruction from "./publications/PracticalReconstruction";


const reload = () => window.location.reload();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Router basename="/portfolio">
      <MenuBar />
      <Switch>
        <Route exact path="/multilayered" component={Multilayered} />
        <Route exact path="/opsr" component={Opsr} />
        <Route exact path="/ears" component={Ears} />
        <Route exact path="/neural_lod" component={NeuralLod} />
        <Route exact path="/neural_bvh" component={NeuralBVH} />
        <Route exact path="/practical_reconstruction" component={PracticalReconstruction} />
        <Route exact path="/" component={App} />
        <Route exact path="/neural_lod_viewer" onEnter={reload} />
        <Route exact path="/neural_bvh_viewer" onEnter={reload} />
        <Route exact path="/practical_reconstruction_viewer" onEnter={reload} />
      </Switch>
    </Router>
  </ThemeProvider>,
  document.querySelector("#root")
);
