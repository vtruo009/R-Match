import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from 'Components/Card';
interface LabelValueProps {
    label: string;
    value?: string | number;
    isParagraph?: boolean;
    link?: string;
}
function LabelValue({ label, value, link, isParagraph = false }: LabelValueProps) {
    return (
        <Card>
            <Grid item container direction='column'>
                <Grid item>
                    <Typography variant='h6' color='primary'>
                        {label}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={isParagraph ? 'body1' : 'h6'}>
                        <a href={link ? `http://${link}` : undefined}>
                            {value ? value : <i>Not provided</i>}
                        </a>
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
}
export default LabelValue;
