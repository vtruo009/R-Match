import React from 'react';
import { AuthContext } from 'Contexts/AuthContext';
import StudentProfileForm from 'Domains/Student/StudentProfileForm';
import FacultyMemberProfileForm from 'Domains/FacultyMember/FacultyMemberProfileForm';

function Profile() {
    const { user } = React.useContext(AuthContext);

    return (
        <div style={{ margin: 50 }}>
            {user?.role === 'student' ? (
                <StudentProfileForm />
            ) : (
                <FacultyMemberProfileForm />
            )}
        </div>
    );
}

export default Profile;
