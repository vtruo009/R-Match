import React from 'react';

import { AuthContext } from 'Contexts/AuthContext';
import StudentProfile from 'Domains/Student/StudentProfile';
import FacultyMemberProfile from 'Domains/FacultyMember/FacultyMemberProfile';

function Profile() {
    const { user } = React.useContext(AuthContext);
    return user ? (
        user.role === 'student' ? (
            <StudentProfile studentId={user.specificUserId} />
        ) : (
            <FacultyMemberProfile facultyMemberId={user.specificUserId} />
        )
    ) : (
        <></>
    );
}

export default Profile;
