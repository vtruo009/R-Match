import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Card from 'Components/Card';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        NonSelected: {
            '&:hover': { backgroundColor: '#efefef' },
        },
        Selected: {
            backgroundColor: '#efefef',
            borderColor: theme.palette.primary.main,
        },
    })
);

interface CardPreviewProps {
    visual: JSX.Element;
    onClick: () => void;
    isSelected: boolean;
    title: string;
    values: { [key: string]: string | number | JSX.Element };
}

function CardPreview({
    visual,
    title,
    values,
    onClick,
    isSelected,
}: CardPreviewProps) {
    const classes = useStyles();
    return (
        <Card
            className={isSelected ? classes.Selected : classes.NonSelected}
            onClick={onClick}
        >
            <Grid container spacing={2} alignItems='center' justify='center'>
                <Grid container item md={3} xs={12} justify='center'>
                    {visual}
                </Grid>
                <Grid item container spacing={1} md={9} xs={12}>
                    <Grid item xs={12}>
                        <Typography variant='h6' color='primary'>
                            {title}
                        </Typography>
                    </Grid>
                    {Object.entries(values).map(([key, value]) => (
                        <Grid item xs={12}>
                            <Typography variant='body1'>
                                {key}: {value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Card>
    );
}

export default CardPreview;
