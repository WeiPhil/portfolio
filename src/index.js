import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App';
import Multilayered from './publications/Multilayered';
import Opsr from './publications/Opsr';
import Ears from './publications/Ears';
import NeuralLod from './publications/NeuralLod';
import NeuralBVH from './publications/NeuralBVH';
import DirectionalHashEncoding from './publications/DirectionalHashEncoding';
import PracticalReconstruction from './publications/PracticalReconstruction';
import MenuBar from './components/MenuBar';
import theme from './theme';

function StaticViewerRedirect({ folder }) {
  useEffect(() => {
    window.location.replace(`${import.meta.env.BASE_URL}${folder}/index.html`);
  }, [folder]);
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router basename="/portfolio">
      <MenuBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/multilayered" element={<Multilayered />} />
        <Route path="/opsr" element={<Opsr />} />
        <Route path="/ears" element={<Ears />} />
        <Route path="/neural_lod" element={<NeuralLod />} />
        <Route path="/neural_bvh" element={<NeuralBVH />} />
        <Route path="/directional_hash_encoding" element={<DirectionalHashEncoding />} />
        <Route path="/practical_reconstruction" element={<PracticalReconstruction />} />
        <Route
          path="/neural_lod_viewer/*"
          element={<StaticViewerRedirect folder="neural_lod_viewer" />}
        />
        <Route
          path="/neural_bvh_viewer/*"
          element={<StaticViewerRedirect folder="neural_bvh_viewer" />}
        />
        <Route
          path="/practical_reconstruction_viewer/*"
          element={<StaticViewerRedirect folder="practical_reconstruction_viewer" />}
        />
        <Route
          path="/directional_hash_encoding_presentation/*"
          element={<StaticViewerRedirect folder="directional_hash_encoding_presentation" />}
        />
      </Routes>
    </Router>
  </ThemeProvider>
);
