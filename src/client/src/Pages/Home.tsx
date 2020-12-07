import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function Home() {
    return (
        <Grid container justify='center' style={{ marginTop: 50 }}>
            <Typography variant='h3'>Welcome to R'Match</Typography>
        </Grid>
    );
}

export default Home;
