import React from 'react';
import Grid from '@material-ui/core/Grid';
import ViewIcon from '@material-ui/icons/Visibility';

import useDialog from 'hooks/useDialog';
import Button from 'Components/Button';
import StudentPreview from 'Domains/Student/StudentPreview';
import StudentProfile from 'Domains/Student/StudentProfile';
import { IStudentPreview } from 'Domains/Student/api';
import PDFViewer from 'Domains/Documents/PDFViewer';

interface StudentsListProps {
    studentPreviews: IStudentPreview[];
}

function StudentsList({ studentPreviews }: StudentsListProps) {
    const { openDialog, DialogProps, Dialog } = useDialog();
    const [selectedDocumentId, setSelectedDocumentId] = React.useState(0);
    const pdfDialog = useDialog();

    const [
        studentSelected,
        setStudentSelected,
    ] = React.useState<IStudentPreview>();
    return (
        <div>
            <Grid container spacing={3} justify='center'>
                {studentPreviews.map((studentPreview, index) => (
                    <Grid item key={index} xs={12}>
                        <StudentPreview
                            studentPreview={studentPreview}
                            onClick={() => {
                                setStudentSelected(studentPreview);
                                openDialog();
                            }}
                            isSelected={
                                studentSelected?.id === studentPreview.id
                            }
                        />
                    </Grid>
                ))}
            </Grid>
            {studentSelected && (
                <Dialog {...DialogProps} title='Student Profile' fullScreen>
                    <StudentProfile studentId={studentSelected.id} />
                    <Grid container spacing={3} style={{ marginTop: 10 }}>
                        <Grid item xs={6}>
                            {studentSelected.resumeId && (
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        setSelectedDocumentId(
                                            studentSelected.resumeId as number
                                        );
                                        pdfDialog.openDialog();
                                    }}
                                    startIcon={<ViewIcon />}
                                >
                                    Resume
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            {studentSelected.transcriptId && (
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        setSelectedDocumentId(
                                            studentSelected.transcriptId as number
                                        );
                                        pdfDialog.openDialog();
                                    }}
                                    startIcon={<ViewIcon />}
                                >
                                    Transcript
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                    <pdfDialog.Dialog
                        {...pdfDialog.DialogProps}
                        maxWidth='lg'
                        title='Document Viewer'
                    >
                        <PDFViewer documentId={selectedDocumentId} />
                    </pdfDialog.Dialog>
                </Dialog>
            )}
        </div>
    );
}

export default StudentsList;
