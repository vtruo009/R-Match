import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';

interface LoaderProps {
    size?: number | string;
    centerPage?: boolean;
    centerRow?: boolean;
    style?: React.CSSProperties;
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

function Loader({
    size = 40,
    centerPage = false,
    style = {},
    centerRow = false,
}: LoaderProps) {
    const classes = useStyles();

    if (centerRow) {
        return (
            <Grid container justify='center'>
                <Loader />
            </Grid>
        );
    }

    return (
        <div
            className={centerPage ? classes.center : classes.nothing}
            style={style}
        >
            <CircularProgress size={size} thickness={5.0} />
        </div>
    );
}

export default Loader;
