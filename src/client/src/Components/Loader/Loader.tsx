import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface props {
    size?: number | string;
}
function Loader({ size = 40 }: props) {
    return (
        <div
            style={{
                top: '50%',
                left: '50%',
                position: 'absolute',
            }}
        >
            <CircularProgress size={size} thickness={5.0} />
        </div>
    );
}

export default Loader;
