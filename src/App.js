import React from 'react';
import { Container, Divider } from '@mui/material';
import PresentationCard from './components/PresentationCard';
import ProjectsOverview from './components/ProjectsOverview';
import Footer from './components/Footer';

function App() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderColor: 'divider',
        borderStyle: 'solid',
        borderWidth: '0px 1px 0px 1px',
        boxShadow: '0 0 32px rgba(15, 23, 42, 0.04)',
      }}
    >
      <PresentationCard />
      <Divider />
      <ProjectsOverview />
      <Footer />
    </Container>
  );
}

export default App;
