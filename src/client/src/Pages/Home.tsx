import React from 'react';
import Typography from '@material-ui/core/Typography';
import UCRLogo from 'static/images/UCRLogo.png';

function Home() {
    return (
        <div style={{ marginTop: 100 }}>
            <img
                src={UCRLogo}
                alt='UCR-Logo'
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '50%',
                }}
            ></img>
            <Typography
                variant='h3'
                align='center'
                color='primary'
                style={{ marginTop: 30 }}
            >
                Welcome to R'Match
            </Typography>
        </div>
    );
}

export default Home;
