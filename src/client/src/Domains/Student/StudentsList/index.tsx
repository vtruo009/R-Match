import React from 'react';
import Grid from '@material-ui/core/Grid';

import useDialog from 'hooks/useDialog';
import StudentPreview from 'Domains/Student/StudentPreview';
import StudentProfile from 'Domains/Student/StudentProfile';
import { IStudent } from 'Domains/Student/api';

interface StudentsResultProps {
    students: IStudent[];
}

function StudentsList({ students }: StudentsResultProps) {
    const [, openDialog, , DialogProps, Dialog] = useDialog();
    const [studentIdSelected, setStudentIdSelected] = React.useState(0);
    return (
        <div>
            <Grid container spacing={3} justify='center'>
                {students.map((student, key) => (
                    <Grid item key={key} xs={12}>
                        <StudentPreview
                            student={student}
                            onClick={() => {
                                setStudentIdSelected(student.id);
                                openDialog();
                            }}
                            isSelected={studentIdSelected === student.id}
                        />
                    </Grid>
                ))}
            </Grid>
            <Dialog {...DialogProps} title='Student Profile' maxWidth='lg'>
                <StudentProfile studentId={studentIdSelected} />
            </Dialog>
        </div>
    );
}

export default StudentsList;
