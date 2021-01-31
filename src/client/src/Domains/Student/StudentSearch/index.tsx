import React from 'react';

import StudentSearchForm from 'Domains/Student/StudentSearchForm';
import { IStudent } from 'Domains/Student/api';
import StudentsList from 'Domains/Student/StudentsList';

function StudentSearch() {
    const [students, setStudents] = React.useState<IStudent[]>([
        {
            id: 1,
            user: {
                id: 1,
                firstName: 'Johan',
                lastName: 'Guzman',
                role: 'student',
                email: 'j@gmail.com',
            },
            department: {
                name: 'computer science',
                id: 1,
                college: {
                    name: 'bcoe',
                    id: 1,
                },
            },
            courses: [],
        },
        {
            id: 2,
            user: {
                id: 1,
                firstName: 'Johan',
                lastName: 'Guzman',
                role: 'student',
                email: 'j@gmail.com',
            },
            department: {
                name: 'computer science',
                id: 1,
                college: {
                    name: 'bcoe',
                    id: 1,
                },
            },
            courses: [],
        },
        {
            id: 4,
            user: {
                id: 1,
                firstName: 'Johan',
                lastName: 'Guzman',
                role: 'student',
                email: 'j@gmail.com',
            },
            department: {
                name: 'computer science',
                id: 1,
                college: {
                    name: 'bcoe',
                    id: 1,
                },
            },
            courses: [],
        },
    ]);
    return (
        <StudentSearchForm
            children={
                <div style={{ paddingTop: 30 }}>
                    {students.length > 0 && (
                        <StudentsList students={students}></StudentsList>
                    )}
                </div>
            }
            setStudents={setStudents}
        />
    );
}
export default StudentSearch;
