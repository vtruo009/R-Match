import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface props {
    size?: number | string;
    center?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        center: {
            top: '50%',
            left: '50%',
            position: 'absolute',
        },
        nothing: {},
    })
);

function Loader({ size = 40, center = false }: props) {
    const classes = useStyles();
    return (
        <div className={center ? classes.center : classes.nothing}>
            <CircularProgress size={size} thickness={5.0} />
        </div>
    );
}

export default Loader;
