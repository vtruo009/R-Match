import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';

interface props {
    size?: number | string;
    center?: boolean;
}

const useStyles = makeStyles(() =>
    createStyles({
        center: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginRight: '-50%',
            transform: `translate(-50%, -50%)`,
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
