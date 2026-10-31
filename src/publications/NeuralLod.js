import React from 'react';
import PublicationLayout from '../components/PublicationLayout';
import { getPublicationById } from '../data/portfolioData';

export default function NeuralLod() {
  return <PublicationLayout publication={getPublicationById('neural_lod')} />;
}
