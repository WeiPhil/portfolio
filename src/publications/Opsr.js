import React from 'react';
import PublicationLayout from '../components/PublicationLayout';
import { getPublicationById } from '../data/portfolioData';

export default function Opsr() {
  return <PublicationLayout publication={getPublicationById('opsr')} />;
}
