import React from 'react';

import { AuthContext } from 'Contexts/AuthContext';
import StudentProfile from 'Domains/Student/StudentProfile';
import FacultyMemberProfile from 'Domains/FacultyMember/FacultyMemberProfile';

function Profile() {
    const { user } = React.useContext(AuthContext);
    return user?.role === 'student' ? (
        <StudentProfile />
    ) : (
        <FacultyMemberProfile />
    );
}

export default Profile;
