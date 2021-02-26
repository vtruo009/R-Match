import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import CardPreview from 'Components/CardPreview';
import { IStudentPreview } from 'Domains/Student/api';

interface Props {
    studentPreview: IStudentPreview;
    onClick: () => void;
    isSelected: boolean;
}

function StudentPreview({ studentPreview, onClick, isSelected }: Props) {
    const prepareValues = () => {
        const { classStanding, department, date } = studentPreview;
        return {
            Major: department?.name ? department?.name : 'Not provided',
            'Class Standing': classStanding ? classStanding : 'Not provided',
            'Applied Date' : date ? date.toLocaleDateString() : undefined
        };
    };

    const getStudentName = () => {
        const { firstName, lastName } = studentPreview.user;
        return `${firstName} ${lastName}`;
    };

    return (
        <CardPreview
            isSelected={isSelected}
            onClick={onClick}
            visual={<Avatar style={{ width: 70, height: 70 }} />}
            title={getStudentName()}
            values={prepareValues()}
        />
    );
}

export default StudentPreview;
