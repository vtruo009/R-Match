import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

interface LabelValueProps {
    label: string;
    value?: string | number;
    isParagraph?: boolean;
}
function LabelValue({ label, value, isParagraph = false }: LabelValueProps) {
    return (
        <Card style={{ padding: 25 }} variant='outlined'>
            <Grid item container direction='column'>
                <Grid item>
                    <Typography variant='h6' color='primary'>
                        {label}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={isParagraph ? 'body1' : 'h6'}>
                        {value ? value : <i>Not provided</i>}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
}
export default LabelValue;
