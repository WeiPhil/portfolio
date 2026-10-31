import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { profileData } from '../data/portfolioData';

const Acknowledgments = ({ customText = null }) => {
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  if (customText) {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          <Box fontWeight={500}>Acknowledgements</Box>
        </Typography>
        <Typography variant="body1" gutterBottom>
          {customText}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Box sx={{ mt: '20px' }}>
        <Typography variant="h5" gutterBottom>
          <Box fontWeight={500}>Acknowledgements</Box>
        </Typography>

        <Box
          display="flex"
          flexDirection={isSmallScreen ? 'column' : 'row'}
          alignItems={isSmallScreen ? 'flex-start' : 'center'}
          gap={2}
        >
          <img
            src={profileData.primeLogo}
            alt="PRIME logo"
            style={{ width: 300, height: 'auto' }}
          />

          <Typography
            variant="body1"
            sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}
          >
            This project received funding from the European Union&apos;s <br />
            Horizon 2020 research and innovation program under the <br /> Marie Skłodowska-Curie
            grant agreement No 956585
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

Acknowledgments.propTypes = {
  customText: PropTypes.string,
};

export default Acknowledgments;
