import React from 'react';
import Grid from '@material-ui/core/Grid';

import useDialog from 'hooks/useDialog';
import StudentPreview from 'Domains/Student/StudentPreview';
import StudentProfile from 'Domains/Student/StudentProfile';
import { IStudentPreview } from 'Domains/Student/api';

interface StudentsResultProps {
    studentPreviews: IStudentPreview[];
}

function StudentsList({ studentPreviews }: StudentsResultProps) {
    const [, openDialog, , DialogProps, Dialog] = useDialog();
    const [studentIdSelected, setStudentIdSelected] = React.useState(0);
    return (
        <div>
            <Grid container spacing={3} justify='center'>
                {studentPreviews.map((studentPreview, key) => (
                    <Grid item key={key} xs={12}>
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
