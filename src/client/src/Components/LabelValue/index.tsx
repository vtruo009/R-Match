import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from 'Components/Card';
interface LabelValueProps {
    label: string;
    rightElement?: JSX.Element;
    value?: string | number;
    isParagraph?: boolean;
    link?: string;
}
function LabelValue({
    label,
    value,
    link,
    isParagraph = false,
    rightElement,
}: LabelValueProps) {
    return (
        <Card>
            <Grid item container direction='column'>
                <Grid container item justify='space-between'>
                    <Grid item>
                        <Typography variant='h6' color='primary'>
                            {label}
                        </Typography>
                    </Grid>
                    <Grid item>{rightElement}</Grid>
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
