// Taking the Student Applied list component and displaying it, essentially like SearchJobs
import React from 'react';
import StudentsList from 'Domains/FacultyMember/StudentsList';
import { IStudent } from 'Domains/Student/api';

// function Dashboard() {
//     const [studentsFetched, setStudentsFetched] = React.useState<IStudent[]>([]);

//     return (
//         // <div style={{ margin:50 }}>
//         <div style={{ padding: 20 }}>
//             {/* {<StudentsList students={studentsFetched}></StudentsList>} */}
//             {studentsFetched.length > 0 && (
//                 // <StudentsList students={studentsFetched} setStudent={setStudentsFetched}></StudentsList>
//                 <StudentsList />
//             )}
//         </div>
//     );
// }

function Dashboard() {
    return <StudentsList />;
}

export default Dashboard;