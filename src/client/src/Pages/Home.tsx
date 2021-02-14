import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { AuthContext } from 'Contexts/AuthContext';
import RecommendedJobs from 'Domains/Jobs/RecommendedJobs';
import NewJobs from 'Domains/Jobs/NewJobs';
import UCRLogo from 'static/images/UCRLogo.png';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '50%',
        },
        largeTopMargin: {
            marginTop: 80,
        },
        smallTopMargin: {
            marginTop: 10,
        },
    })
);

function Home() {
    const classes = useStyles();
    const { user } = React.useContext(AuthContext);
    return (
        <div style={{ marginTop: 100 }}>
            <img src={UCRLogo} alt='UCR-Logo' className={classes.image} />
            <Typography
                variant='h3'
                align='center'
                color='primary'
                className={classes.smallTopMargin}
            >
                Welcome to R'Match
            </Typography>
            {user && user.role === 'student' && (
                <div>
                    <div className={classes.largeTopMargin}>
                        <RecommendedJobs />
                    </div>
                    <div className={classes.largeTopMargin}>
                        <NewJobs />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
