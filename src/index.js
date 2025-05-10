// import React from "react";
// import ReactDOM from "react-dom";
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
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PracticalReconstruction from "./publications/PracticalReconstruction";

import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));

const reload = () => window.location.reload();

root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Router basename="/portfolio">
      <MenuBar />
      <Routes>
        <Route exact path="/multilayered" element={<Multilayered />} />
        <Route exact path="/opsr" element={<Opsr />} />
        <Route exact path="/ears" element={<Ears />} />
        <Route exact path="/neural_lod" element={<NeuralLod />} />
        <Route exact path="/neural_bvh" element={<NeuralBVH />} />
        <Route exact path="/practical_reconstruction" element={<PracticalReconstruction />} />
        <Route exact path="/" element={<App />} />
        <Route exact path="/neural_lod_viewer" onEnter={reload} />
        <Route exact path="/neural_bvh_viewer" onEnter={reload} />
        <Route exact path="/practical_reconstruction_viewer" onEnter={reload} />
      </Routes>
    </Router>
  </ThemeProvider>
  // document.querySelector("#root")
);
