import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Checkbox
 } from '@material-ui/core';
import Button from 'Components/Button';
import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import DocumentUploadForm, { IDocumentUploadForm } from 'Domains/Documents/DocumentUploadForm/index';
import { IDocument, getDocuments, deleteDocument } from 'Domains/Documents/api';
import { formatDateString  } from 'utils/format';
import PDFViewer from 'Domains/Documents/PDFViewer';
//import DeleteButton from 'Components/DeleteButton';

//create initial file initial values here
const fileInitialValues: IDocumentUploadForm = {
    name: '',
    type: '',
    isDefault: false,
    dateAdded: '',
    document: Buffer.from([]),
};

export interface DocumentProps {
    name: JSX.Element | string,
    type: string,
    isDefault: boolean,
    dateAdded: string, //change to Date later
    document: Buffer,
}

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    }
});

// function createData(
//     name: JSX.Element | string,
//     isDefault: boolean,
//     dateAdded: string,
//     document: Buffer,
// ) : DocumentProps {
//     return { name, isDefault, dateAdded, document };
// };

// const rows = [
//     createData('Resume.pdf', true, '01/02/2021', Buffer.alloc(0)),
    // createData('Resume.pdf', true, '01/02/2021'),
    // createData('Resume.pdf', true, '01/02/2021'),
    // createData('Resume.pdf', true, '01/02/2021'),
    // createData('Resume.pdf', true, '01/02/2021'),
//];

function Documents() {
    
    const classes = useStyles();
    const uploadDialog = useDialog();
    const resumeDialog = useDialog();
    const transcriptDialog = useDialog();
    const [resumes, setResumes] = React.useState<IDocument[]>([]);
    const [transcripts, setTranscripts] = React.useState<IDocument[]>([]);
    const [checked, setChecked] = React.useState(false);

    const request = React.useCallback(
        () =>
            getDocuments(),
            []
    );
    

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const documents = response.data.documents;
            let filteredRes: IDocument[] = [];
            let filteredTrans: IDocument[] = [];
            for (var item in documents) {
                if (documents[item].type === 'resume') {
                    filteredRes[item] = documents[item];
                }
                else {
                    filteredTrans[item] = documents[item];
                }
            }
            setResumes(filteredRes);
            setTranscripts(filteredTrans);
        }
    })
    React.useEffect(() => sendRequest(), [sendRequest]);

    const handleChange = () => {
        setChecked(true);
    };

    const ref = React.createRef();

    // This is how I originally did it but figured that the delete should be in the PDFViewer component so I moved it
    /*const deleteRequest = React.useCallback(() => deleteDocument(9), [9])
    const removeDocument = (docId: number, docType: string) => {
        if (docType === 'resume') {
            for (var item in resumes) {
                if (resumes[item].id === docId) {
                    resumes.splice(parseInt(item), 1);
                }
            }
        }
        else {
            for (var item in transcripts) {
                if (transcripts[item].id === docId) {
                    transcripts.splice(parseInt(item), 1);
                }
            }
        }
        setResumes(resumes);
        setTranscripts(transcripts);
        resumeDialog.closeDialog();
        transcriptDialog.closeDialog();
    };*/
    const handleSubmit = () => {
        resumeDialog.closeDialog();
        transcriptDialog.closeDialog();
        sendRequest();
    }
    
    return (
        <div>
            <Typography variant='h4' style={{ marginBottom: 10 }}>
                Resumes
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead style={{ "backgroundColor": 'gainsboro'}}>
                        <TableRow >
                            <TableCell align='justify' style={{ width: '75%'}}>Name</TableCell>
                            <TableCell align='center'>Default</TableCell>
                            <TableCell align='center'>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumes.map( (resume, index) => (
                            <TableRow key={index}>
                                <TableCell onClick={resumeDialog.openDialog}>{resume.name}</TableCell>
                                
                                <resumeDialog.Dialog {...resumeDialog.DialogProps} title='File Viewer'>
                                    {/* <DeleteButton
                                        message='Are you sure you want to delete this resume?'
                                        onDeleteRequest={deleteRequest}
                                        onSuccess={() => removeDocument(resume.id, resume.type)}
                                    /> */}
                                    <PDFViewer
                                        document={resume}
                                        onSubmit={handleSubmit}
                                    />
                                </resumeDialog.Dialog>

                                <TableCell align='center'><Checkbox color='primary'></Checkbox></TableCell>
                                <TableCell align='center'>{formatDateString(new Date(resume.dateAdded).toLocaleDateString())}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant='h4' style={{ marginBottom: 10, marginTop: 100 }}>
                Transcripts
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead style={{ "backgroundColor": 'gainsboro'}}>
                        <TableRow >
                            <TableCell align='justify' style={{ width: '75%'}}>Name</TableCell>
                            <TableCell align='center'>Default</TableCell>
                            <TableCell align='center'>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transcripts.map( (transcript, index) => (
                            <TableRow key={index}>
                                <TableCell onClick={transcriptDialog.openDialog} >{transcript.name}</TableCell>

                                <transcriptDialog.Dialog {...transcriptDialog.DialogProps} title='File Viewer'>
                                    {/* <DeleteButton
                                        message='Are you sure you want to delete this transcript?'
                                        onDeleteRequest={deleteRequest}
                                        onSuccess={() => removeDocument(transcript.id, transcript.type)}
                                    /> */}
                                    <PDFViewer
                                        document={transcript} // how do i get the document that is clicked on
                                        onSubmit={handleSubmit}
                                    />
                                </transcriptDialog.Dialog>

                                <TableCell align='center'>
                                    <Checkbox
                                        color='primary'
                                        onClick={handleChange}
                                        //checked={checked}
                                        disabled={(transcript.isDefault !== true) && !checked}
                                    />
                                </TableCell>
                                <TableCell align='center' >{formatDateString(transcript.dateAdded.toString())}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                style={{ float: 'right', marginTop: 100, marginBottom: 100, marginRight: 35 }}
                onClick={uploadDialog.openDialog}
            >
                Add a Document
            </Button>
            <uploadDialog.Dialog {...uploadDialog.DialogProps} title='Add a Document'>
                    <DocumentUploadForm
                        // isLoading={false}
                        // onCancel={closeDialog}
                        // onSubmit={(fileBaseValues) => {
                        //     closeDialog();
                        //     //sendRequest();
                        // }}
                        // formInitialValues={fileInitialValues}
                        onSubmit={uploadDialog.closeDialog}
                    />
            </uploadDialog.Dialog>
        </div>
    );
}

export default Documents;