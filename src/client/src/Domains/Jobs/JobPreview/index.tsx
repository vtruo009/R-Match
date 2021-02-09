import React from 'react';
import AssistantIcon from '@material-ui/icons/AssistantPhoto';
import GraderIcon from '@material-ui/icons/Assignment';
import ResearchIcon from '@material-ui/icons/FindInPage';
import TutorIcon from '@material-ui/icons/SupervisedUserCircle';
import VolunteerIcon from '@material-ui/icons/Accessibility';
import OtherIcon from '@material-ui/icons/Help';

import CardPreview from 'Components/CardPreview';
import { IJob, jobType } from 'Domains/Jobs/api';
import { formatDateString, formatSalary } from 'utils/format';

interface JobPreviewProps {
    job: IJob;
    onClick: () => void;
    isSelected: boolean;
    hasPermission: boolean;
}

const getIcon = (type: jobType): JSX.Element => {
    const color = 'primary';
    const fontSize = 60;
    switch (type) {
        case 'assistant':
            return <AssistantIcon style={{ fontSize }} color={color} />;
        case 'grader':
            return <GraderIcon style={{ fontSize }} color={color} />;
        case 'researcher':
            return <ResearchIcon style={{ fontSize }} color={color} />;
        case 'tutor':
            return <TutorIcon style={{ fontSize }} color={color} />;
        case 'volunteer':
            return <VolunteerIcon style={{ fontSize }} color={color} />;
        default:
            return <OtherIcon style={{ fontSize }} color={color} />;
    }
};

function JobPreview({
    job,
    onClick,
    isSelected,
    hasPermission,
}: JobPreviewProps) {
    const getJobPosterName = () => {
        const { title, user } = job.facultyMember;
        const { firstName, lastName } = user;
        const _title = title ? title : '';
        return `${_title} ${firstName} ${lastName}`;
    };

    const prepareValues = () => {
        const values: { [key: string]: string | number } = {
            'Hours per week': job.hoursPerWeek,
        };

        if (job.minSalary > 0) {
            values['Hourly wage'] = formatSalary(job.minSalary, job.maxSalary);
        }

        if (hasPermission) {
            values['Posted on'] = formatDateString(job.postedOn);
        } else {
            values['Posted by'] = getJobPosterName();
        }

        return values;
    };

    return (
        <CardPreview
            onClick={onClick}
            isSelected={isSelected}
            visual={getIcon(job.type[0])}
            title={job.title}
            values={prepareValues()}
        />
    );
}

export default JobPreview;
