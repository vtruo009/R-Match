import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

interface Props {
    label: string;
    value?: string | string[] | number;
    isParagraph?: boolean;
}

function LabelValue({ label, value, isParagraph = false }: Props) {
    return (
        <Grid item container direction='column'>
            <Grid item>
                <Typography variant='h6' color='primary'>
                    {label}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant={isParagraph ? 'body1' : 'h6'}>
                    {value ? value : <i> Not provided</i>}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default LabelValue;
