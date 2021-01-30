import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import CardPreview from 'Components/CardPreview';
import { IStudent } from 'Domains/Student/api';

interface Props {
    student: IStudent;
    onClick: () => void;
    isSelected: boolean;
}

function StudentPreview({ student, onClick, isSelected }: Props) {
    const prepareValues = () => {
        const departmentName = student.department?.name;
        const classStanding = student.classStanding;
        const values: { [key: string]: string | number | JSX.Element } = {
            Major: departmentName ? departmentName : 'Not provided',
            'Class Standing': classStanding ? (
                classStanding
            ) : (
                <i>Not provided</i>
            ),
        };
        return values;
    };

    const getStudentName = () => {
        const { firstName, lastName } = student.user;
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
