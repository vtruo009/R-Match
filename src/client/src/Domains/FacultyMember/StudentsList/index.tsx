//This is the Students List component; essentially like JobResults
import React from 'react';
import Grid from '@material-ui/core/Grid';
import StudentPreview from 'Components/StudentPreview';
import { getStudentsApplied } from '../api';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { IStudent } from 'Domains/Student/api';
import { Pagination} from '@material-ui/lab';

// interface Props {
//     students: IStudent[];
//     setStudent: (students: IStudent[]) => void;
// }
interface StudentsListProps {
    jobId: number;
}

const numOfItems = 2;
function StudentsList({ jobId } : StudentsListProps ) {
    const [page, setPage] = React.useState(1);
    const [numOfPages, setNumOfPages] = React.useState(0);
    const [students, setStudents] = React.useState<IStudent[]>([]);
    const [snack] = useSnack();
    const request = React.useCallback(
        () =>
            getStudentsApplied(
                jobId,
                page,
                numOfItems
            ),
        [jobId, page, numOfItems]
    );

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const jobApplications = response.data.jobApplications;
            const jobApplicationsCount = response.data.jobApplicationsCount;
            const students = jobApplications.map((jobApplication) => (
                jobApplication.student
            ))
            // console.log(`*************THE COUNT IS ${jobApplicationsCount}`);

            if (students.length === 0) {
                setStudents([]);
                snack('No students were found', 'warning');
            } else {
                setNumOfPages(Math.ceil(jobApplicationsCount / numOfItems));
                setStudents(students);
            }
        },
    });

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
        sendRequest();
        window.scrollTo(0, 0);
    };

    const handleSearchAgain = () => {
        if (page > 0) {
            setPage(1);
        }
        sendRequest();
    };

    React.useEffect(() => {
        sendRequest();
    }, [jobId]);

    return (
        <div>
            <Grid container spacing={3} style={{ marginTop: 20 }}>
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
                        {numOfPages > 1 && (
                            <Grid item >
                                <Pagination //align to center next
                                    color='primary'
                                    shape='rounded'
                                    page={page}
                                    count={numOfPages}
                                    onChange={handlePageChange}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            
        </div>

    );
}

export default StudentsList;