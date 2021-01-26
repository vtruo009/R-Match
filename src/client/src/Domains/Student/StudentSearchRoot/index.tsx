import React from 'react';

import StudentSearchForm from 'Domains/Student/StudentSearchForm';
import { IStudent } from 'Domains/Student/api';

function StudentSearchRoot() {
    const [students, setStudents] = React.useState<IStudent[]>([]);
    return (
        <StudentSearchForm
            children={
                <div>
                    {/* {students.length > 0 && (
                        <JobResults jobs={students}></JobResults>
                    )} */}
                </div>
            }
            setStudents={setStudents}
        />
    );
}
export default StudentSearchRoot;
