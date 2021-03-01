import React from 'react';
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
        campusImage: {
            width: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
        },
    })
);

function Home() {
    const classes = useStyles();
    const { user } = React.useContext(AuthContext);
    return (
        <div>
            <img
                src='https://img.emg-services.net/institutes/institute32879/uc_riverside.jpg'
                alt='Campus'
                className={classes.campusImage}
            />
            <div
                style={{ position: 'relative', height: 'calc(100vh - 450px)' }}
            >
                <img src={UCRLogo} alt='UCR-Logo' className={classes.image} />
            </div>
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
