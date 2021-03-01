import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CheckBox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import DocumentIcon from '@material-ui/icons/Description';

import { formatDateString } from 'utils/format';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import DeleteButton from 'Components/DeleteButton';
import Loader from 'Components/Loader';
import Table from 'Components/Table';
import Button from 'Components/Button';
import DocumentUploadForm from 'Domains/Documents/DocumentUploadForm/index';
import {
    IDocument,
    getDocuments,
    deleteDocument,
    markDocumentAsDefault,
} from 'Domains/Documents/api';
import PDFViewer from 'Domains/Documents/PDFViewer';

function DocumentsTable() {
    const uploadDialog = useDialog();
    const pdfDialog = useDialog();
    const [snack] = useSnack();
    const [resumes, setResumes] = React.useState<IDocument[]>([]);
    const [transcripts, setTranscripts] = React.useState<IDocument[]>([]);
    const [defaultResumeId, setDefaultResumeId] = React.useState(0);
    const [defaultTranscriptId, setDefaultTranscriptId] = React.useState(0);
    const [documentIdToDelete, setDocumentIdToDelete] = React.useState(0);
    const [
        documentIdSelected,
        setDocumentIdSelected,
    ] = React.useState<number>();
    const [defaultDocumentData, setDefaultDocumentData] = React.useState<{
        documentId: IDocument['id'];
        type: IDocument['type'];
    }>({
        documentId: 0,
        type: 'resume',
    });

    const deleteDocumentRequest = React.useCallback(
        () => deleteDocument(documentIdToDelete),
        [documentIdToDelete]
    );
    const getDocumentsRequest = React.useCallback(() => getDocuments(), []);
    const markDocumentAsDefaultRequest = React.useCallback(
        () =>
            markDocumentAsDefault(
                defaultDocumentData.documentId,
                defaultDocumentData.type
            ),
        [defaultDocumentData]
    );

    const [sendGetDocumentsRequest, isLoading] = useApi(getDocumentsRequest, {
        onSuccess: (response) => {
            const { resumes, transcripts } = response.data.documents;
            resumes.forEach((resume) => {
                if (resume.isDefault) setDefaultResumeId(resume.id);
            });
            setResumes(resumes);
            transcripts.forEach((transcript) => {
                if (transcript.isDefault) setDefaultTranscriptId(transcript.id);
            });
            setTranscripts(transcripts);
        },
    });

    const [sendMarkDocumentAsDefaultRequest] = useApi(
        markDocumentAsDefaultRequest,
        {
            onSuccess: () =>
                snack('Document successfully marked as default', 'success'),
        }
    );

    React.useEffect(() => sendGetDocumentsRequest(), [sendGetDocumentsRequest]);

    return isLoading ? (
        <Loader centerPage />
    ) : (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <Typography variant='h4' color='primary'>
                    Resumes{' '}
                    <Badge
                        badgeContent={resumes.length}
                        color='primary'
                        showZero
                    >
                        <DocumentIcon />
                    </Badge>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {resumes.length > 0 && (
                    <Table
                        columns={['Name', 'Default', 'Date Added', 'Delete']}
                    >
                        <>
                            {resumes.map((resume, index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        onClick={() => {
                                            setDocumentIdSelected(resume.id);
                                            pdfDialog.openDialog();
                                        }}
                                    >
                                        {resume.name}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <CheckBox
                                            color='secondary'
                                            onClick={() => {
                                                setDefaultDocumentData({
                                                    documentId: resume.id,
                                                    type: 'resume',
                                                });
                                                sendMarkDocumentAsDefaultRequest();
                                                setDefaultResumeId(resume.id);
                                            }}
                                            checked={
                                                resume.id === defaultResumeId
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {formatDateString(resume.dateAdded)}
                                    </TableCell>
                                    <TableCell>
                                        <DeleteButton
                                            disabled={
                                                resume.id === defaultResumeId
                                            }
                                            message={`Please confirm deletion of the document: ${resume.name}`}
                                            onClickBeforeRequest={() =>
                                                setDocumentIdToDelete(resume.id)
                                            }
                                            onDeleteRequest={
                                                deleteDocumentRequest
                                            }
                                            onSuccess={() =>
                                                setResumes(
                                                    resumes.filter(
                                                        (_resume) =>
                                                            _resume.id !==
                                                            resume.id
                                                    )
                                                )
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    </Table>
                )}
            </Grid>
            <Divider />
            <Grid item xs={12}>
                <Typography
                    variant='h4'
                    style={{ marginBottom: 20 }}
                    color='primary'
                >
                    Transcripts{' '}
                    <Badge
                        badgeContent={transcripts.length}
                        color='primary'
                        showZero
                    >
                        <DocumentIcon />
                    </Badge>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {transcripts.length > 0 && (
                    <Table
                        columns={['Name', 'Default', 'Date Added', 'delete']}
                    >
                        <>
                            {transcripts.map((transcript, index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        onClick={() => {
                                            setDocumentIdSelected(
                                                transcript.id
                                            );
                                            pdfDialog.openDialog();
                                        }}
                                    >
                                        {transcript.name}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <CheckBox
                                            color='secondary'
                                            onClick={() => {
                                                setDefaultDocumentData({
                                                    documentId: transcript.id,
                                                    type: 'transcript',
                                                });
                                                sendMarkDocumentAsDefaultRequest();
                                                setDefaultTranscriptId(
                                                    transcript.id
                                                );
                                            }}
                                            checked={
                                                transcript.id ===
                                                defaultTranscriptId
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {formatDateString(transcript.dateAdded)}
                                    </TableCell>
                                    <TableCell>
                                        <DeleteButton
                                            disabled={
                                                transcript.id ===
                                                defaultTranscriptId
                                            }
                                            message={`Please confirm deletion of the document: ${transcript.name}`}
                                            onClickBeforeRequest={() =>
                                                setDocumentIdToDelete(
                                                    transcript.id
                                                )
                                            }
                                            onDeleteRequest={
                                                deleteDocumentRequest
                                            }
                                            onSuccess={() =>
                                                setTranscripts(
                                                    transcripts.filter(
                                                        (_transcript) =>
                                                            _transcript.id !==
                                                            transcript.id
                                                    )
                                                )
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    </Table>
                )}
            </Grid>
            <Grid container item xs={12} justify='flex-end'>
                <Button onClick={uploadDialog.openDialog}>
                    Add a Document
                </Button>
            </Grid>
            {documentIdSelected && (
                <pdfDialog.Dialog
                    {...pdfDialog.DialogProps}
                    title='File Viewer'
                >
                    <PDFViewer documentId={documentIdSelected} />
                </pdfDialog.Dialog>
            )}
            <uploadDialog.Dialog
                {...uploadDialog.DialogProps}
                title='Add a Document'
            >
                <DocumentUploadForm
                    onSubmit={() => {
                        uploadDialog.closeDialog();
                        sendGetDocumentsRequest();
                    }}
                />
            </uploadDialog.Dialog>
        </Grid>
    );
}

export default DocumentsTable;
