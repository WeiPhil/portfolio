import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Box, Link } from '@mui/material';

function AuthorBanner({ authorData }) {
  return (
    <Grid
      container
      paddingTop={3}
      paddingBottom={3}
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      {authorData
        .filter((item) => item && item.name !== null)
        .map((item, idx) => {
          const key = typeof item.name === 'string' ? item.name : `author-${idx}`;
          return (
            <Grid item sm={4} key={key}>
              <Typography component="div" sx={{ textAlign: 'center' }}>
                <Box fontWeight={500} sx={{ display: 'inline-block' }}>
                  {item.url ? (
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </Box>

                {item.affiliations &&
                  item.affiliations.map((authorAffiliation) => (
                    <Box key={authorAffiliation}>
                      <Box fontStyle="italic" sx={{ display: 'inline-block' }}>
                        {authorAffiliation}{' '}
                      </Box>
                    </Box>
                  ))}
              </Typography>
            </Grid>
          );
        })}
    </Grid>
  );
}

AuthorBanner.propTypes = {
  authorData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.node,
      url: PropTypes.string,
      affiliations: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default AuthorBanner;
