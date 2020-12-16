import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
interface Props {
    label: string;
    value?: string | string[] | number;
    isParagraph?: boolean;
}
function LabelValue({ label, value, isParagraph = false }: Props) {
    const prepareValue = () =>
        typeof value === 'object' ? value.join(', ') : value;

    const checkValue = () => {
        if (!value) return false;
        if (typeof value === 'object' && value.length === 0) return false;
        return true;
    };

    return (
        <Grid item container direction='column'>
            <Grid item>
                <Typography variant='h6' color='primary'>
                    {label}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant={isParagraph ? 'body1' : 'h6'}>
                    {checkValue() ? prepareValue() : <i>Not provided</i>}
                </Typography>
            </Grid>
        </Grid>
    );
}
export default LabelValue;
