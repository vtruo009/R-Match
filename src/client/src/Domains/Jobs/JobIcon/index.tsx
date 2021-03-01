import React from 'react';
import Badge from '@material-ui/core/Badge';
import MUIJobIcon from '@material-ui/icons/WorkOutline';

interface JobIconProps {
    numberOfJobs: number;
}

function JobIcon({ numberOfJobs }: JobIconProps) {
    return (
        <Badge badgeContent={numberOfJobs} color='secondary' showZero>
            <MUIJobIcon color='primary' />
        </Badge>
    );
}

export default JobIcon;
