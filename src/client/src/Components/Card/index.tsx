import React from 'react';
import MUICard, { CardProps as MUICardProps } from '@material-ui/core/Card';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        colorBorder: {
            borderColor: theme.palette.primary.main,
        },
    })
);

interface CardProps extends MUICardProps {
    colorBorder?: boolean;
}
function Card({ colorBorder = false, ...passThroughProps }: CardProps) {
    const classes = useStyles();
    return (
        <MUICard
            className={colorBorder ? classes.colorBorder : ''}
            style={{ padding: 25, borderRadius: 15 }}
            variant='outlined'
            {...passThroughProps}
        />
    );
}

export default Card;
