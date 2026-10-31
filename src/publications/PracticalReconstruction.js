import React from 'react';
import PublicationLayout from '../components/PublicationLayout';
import { getPublicationById } from '../data/portfolioData';

export default function PracticalReconstruction() {
  return <PublicationLayout publication={getPublicationById('practical_reconstruction')} />;
}
