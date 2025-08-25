import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

const Acknowledgments = () => {
    const isSmallScreen = useMediaQuery('(max-width:900px)');

    return (
        <div>
            <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
                <Box style={{ marginTop: 20 }}>
                    <Typography variant="h5" gutterBottom>
                        <Box fontWeight={500}>Acknowledgements</Box>
                    </Typography>

                    <Box
                        display="flex"
                        flexDirection={isSmallScreen ? 'column' : 'row'} // Stack on small screens
                        alignItems={isSmallScreen ? 'flex-start' : 'center'} // Align to start on smaller screens
                        gap={2}
                    >
                        <img
                            src={require("../data/images/prime_logo.png")}
                            alt="PRIME logo"
                            style={{ width: 300, height: 'auto' }}
                        />

                        <Typography variant="body1" style={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
                            This project received funding from the European Union's <br />
                            Horizon 2020 research and innovation program under the <br /> Marie Skłodowska-Curie
                            grant agreement No 956585
                        </Typography>
                    </Box>
                </Box>
            </Typography>

        </div>

    );
};

export default Acknowledgments;