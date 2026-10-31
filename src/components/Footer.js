import React from 'react';
import { Divider, Typography } from '@mui/material';

function Footer() {
  return (
    <React.Fragment>
      <Divider />
      <Typography
        sx={{
          pt: '20px',
          pb: '20px',
          textAlign: 'center',
        }}
        variant="subtitle1"
        color="text.secondary"
        gutterBottom
      >
        © 2026 Philippe Weier
      </Typography>
    </React.Fragment>
  );
}

export default Footer;
