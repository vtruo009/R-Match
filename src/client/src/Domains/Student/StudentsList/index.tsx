import React from 'react';
import Grid from '@material-ui/core/Grid';

import useDialog from 'hooks/useDialog';
import StudentPreview from 'Domains/Student/StudentPreview';
import StudentProfile from 'Domains/Student/StudentProfile';
import { IStudentPreview } from 'Domains/Student/api';

interface StudentsListProps {
    studentPreviews: IStudentPreview[];
}

function StudentsList({ studentPreviews }: StudentsListProps) {
    const { openDialog, DialogProps, Dialog } = useDialog();
    const [studentIdSelected, setStudentIdSelected] = React.useState(0);
    return (
        <div>
            <Grid container spacing={3} justify='center'>
                {studentPreviews.map((studentPreview, index) => (
                    <Grid item key={index} xs={12}>
                        <StudentPreview
                            studentPreview={studentPreview}
                            onClick={() => {
                                setStudentIdSelected(studentPreview.id);
                                openDialog();
                            }}
                            isSelected={studentIdSelected === studentPreview.id}
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
