import React from 'react';
import PublicationLayout from '../components/PublicationLayout';
import { getPublicationById } from '../data/portfolioData';

export default function NeuralBVH() {
  return <PublicationLayout publication={getPublicationById('neural_bvh')} />;
}
