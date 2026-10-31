import React from 'react';
import PublicationLayout from '../components/PublicationLayout';
import { getPublicationById } from '../data/portfolioData';

export default function Ears() {
  return <PublicationLayout publication={getPublicationById('ears')} />;
}
