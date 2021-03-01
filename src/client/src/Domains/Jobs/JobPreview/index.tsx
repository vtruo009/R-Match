import React from 'react';

import useDialog from 'hooks/useDialog';
import CardPreview from 'Components/CardPreview';
import Button from 'Components/Button';
import FacultyMemberProfile from 'Domains/FacultyMember/FacultyMemberProfile';
import JobTypeIcon from 'Domains/Jobs/JobTypeIcon';
import { IJob } from 'Domains/Jobs/api';
import { formatDateString, formatSalary, shortenString } from 'utils/format';

interface JobPreviewProps {
    job: IJob;
    onClick: () => void;
    isSelected: boolean;
    hasPermission: boolean;
}

function JobPreview({
    job,
    onClick,
    isSelected,
    hasPermission,
}: JobPreviewProps) {
    const { openDialog, DialogProps, Dialog } = useDialog();

    const getJobPosterName = () => {
        const { title, user } = job.facultyMember;
        const { firstName, lastName } = user;
        const _title = title ? title : '';
        return `${_title} ${firstName} ${lastName}`;
    };

    const prepareValues = () => {
        const values: { [key: string]: string | number | JSX.Element } = {
            'Hours per week': job.hoursPerWeek,
        };

        if (job.minSalary > 0) {
            values['Hourly wage'] = formatSalary(job.minSalary, job.maxSalary);
        }

        if (hasPermission) {
            values['Posted on'] = formatDateString(job.postedOn);
        } else {
            values['Posted by'] = (
                <Button variant='text' onClick={openDialog}>
                    {getJobPosterName()}
                </Button>
            );
        }
        return values;
    };

    return (
        <>
            <CardPreview
                onClick={onClick}
                isSelected={isSelected}
                visual={<JobTypeIcon type={job.type[0]} size={60} />}
                title={shortenString(job.title, 20)}
                values={prepareValues()}
            />
            <Dialog
                {...DialogProps}
                title='Faculty Member Profile'
                maxWidth='lg'
            >
                <FacultyMemberProfile facultyMemberId={job.facultyMember.id} />
            </Dialog>
        </>
    );
}

export default JobPreview;
