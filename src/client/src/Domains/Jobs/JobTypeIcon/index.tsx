import React from 'react';
import AssistantIcon from '@material-ui/icons/AssistantPhoto';
import GraderIcon from '@material-ui/icons/Assignment';
import ResearchIcon from '@material-ui/icons/FindInPage';
import TutorIcon from '@material-ui/icons/SupervisedUserCircle';
import VolunteerIcon from '@material-ui/icons/Accessibility';
import OtherIcon from '@material-ui/icons/Help';

import { jobType } from '../api';

interface JobTypeIconProps {
    type: jobType;
    size: number;
}

function JobTypeIcon({ type, size }: JobTypeIconProps) {
    const getIcon = (type: jobType): JSX.Element => {
        const color = 'primary';
        switch (type) {
            case 'assistant':
                return (
                    <AssistantIcon style={{ fontSize: size }} color={color} />
                );
            case 'grader':
                return <GraderIcon style={{ fontSize: size }} color={color} />;
            case 'researcher':
                return (
                    <ResearchIcon style={{ fontSize: size }} color={color} />
                );
            case 'tutor':
                return <TutorIcon style={{ fontSize: size }} color={color} />;
            case 'volunteer':
                return (
                    <VolunteerIcon style={{ fontSize: size }} color={color} />
                );
            default:
                return <OtherIcon style={{ fontSize: size }} color={color} />;
        }
    };

    return getIcon(type);
}

export default JobTypeIcon;
