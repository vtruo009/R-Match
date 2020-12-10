import React from 'react';
import { AuthContext } from 'Contexts/AuthContext';
import StudentProfile from 'Domains/Student/StudentProfile';
import FacultyMemberProfileForm from 'Domains/FacultyMember/FacultyMemberProfileForm';

function Profile() {
    const { user } = React.useContext(AuthContext);

    return (
        <div style={{ margin: 50 }}>
            {user?.role === 'student' ? (
                <StudentProfile />
            ) : (
                <FacultyMemberProfileForm />
            )}
        </div>
    );
}

export default Profile;
