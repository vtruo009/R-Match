//This is the Students List component; essentially like JobResults
import React from 'react';
import Grid from '@material-ui/core/Grid';
import StudentPreview from 'Components/StudentPreview';
import { getStudentsApplied } from '../api';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { IStudent } from 'Domains/Student/api';
//impo api hook

// interface Props {
//     students: IStudent[];
//     setStudent: (students: IStudent[]) => void;
// }

function StudentsList() {
    const [students, setStudents] = React.useState<IStudent[]>([]);
    const [snack] = useSnack();
    const request = React.useCallback(
        () =>
            getStudentsApplied( // the one that makes req
            ),
        [] // none as of now
    );

    const [sendRequest, isLoading] = useApi(request, { // in students list omponent if isLoading T then spinner
        onSuccess: (response) => { // save student result in state of this component
            const jobApplications = response.data.jobApplications; // <- name of array 
            const students = jobApplications.map((jobApplication) => (
                jobApplication.student
            ))
            //const count = response.data.jobsCount;
            //console.log(count);

            if (students.length === 0) {
                snack('No students were found', 'warning');
            } else {
                // setNumOfPages(Math.ceil(count / numOfItems));
                // setJobs(jobs);
                setStudents(students);
            }
        },
    });

    React.useEffect(() => {
        // can call sendRequest
        sendRequest();
    }, []);
    // Maybe need to add reset?
    // React.useEffect(() => {
    //     setStudentSelected(students[0]);
    // }, [students]);
    //const studs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
        <Grid container spacing={3} style={{ marginTop: 20 }}>
            {/* {<h1>Professor's Dashboard</h1>} */}
            <Grid item xs={5}>
                <Grid container spacing={3} direction='column'>
                    {students.map((student, key) => (
                        <Grid item key={key}>
                            <StudentPreview
                                student={student}
                                //onClick={setStudents}
                                //isSelected={student.id === studentSelected.id}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default StudentsList;