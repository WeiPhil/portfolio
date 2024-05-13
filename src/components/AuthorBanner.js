import React from "react";
import { Typography } from "@mui/material";
import { Grid, Box } from "@mui/material";

function AuthorBanner(props) {

    const { authorData } = props;
    return (
        <React.Fragment>
            <Grid container paddingTop={3} paddingBottom={3} spacing={2} justifyContent="center" alignItems="center">

                {authorData.map(item => (
                    <>
                        {item.name !== null && (
                            <Grid item sm={4} justifyContent="top">
                                <Typography style={{ textAlign: "center" }}>

                                    <Box fontWeight={500} style={{ display: 'inline-block' }}>{item.name}</Box>


                                    {item.affiliations.map(authorAffiliation => (
                                        <>
                                            <Grid />

                                            <Box fontStyle="italic" style={{ display: 'inline-block' }}>{authorAffiliation} </Box>

                                        </>
                                    ))

                                    }

                                </Typography>

                            </Grid >
                        )}
                    </>
                ))}

            </Grid>

        </React.Fragment >
    );
}

export default AuthorBanner;
