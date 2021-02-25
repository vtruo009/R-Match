import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CheckBox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import DocumentIcon from '@material-ui/icons/Description';

import DeleteButton from 'Components/DeleteButton';
import Loader from 'Components/Loader';
import Table from 'Components/Table';
import Button from 'Components/Button';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import DocumentUploadForm from 'Domains/Documents/DocumentUploadForm/index';
import { IDocument, getDocuments, deleteDocument } from 'Domains/Documents/api';
import { formatDateString } from 'utils/format';
import PDFViewer from 'Domains/Documents/PDFViewer';

export interface DocumentProps {
    name: JSX.Element | string;
    type: string;
    isDefault: boolean;
    dateAdded: string;
    document: Buffer;
}

function Documents() {
    const uploadDialog = useDialog();
    const pdfDialog = useDialog();
    const [snack] = useSnack();
    const [resumes, setResumes] = React.useState<IDocument[]>([]);
    const [transcripts, setTranscripts] = React.useState<IDocument[]>([]);
    const [documentIdToDelete, setDocumentIdToDelete] = React.useState(0);
    const [checked, setChecked] = React.useState(false);
    const [
        documentIdSelected,
        setDocumentIdSelected,
    ] = React.useState<number>();

    const getDocumentsRequest = React.useCallback(() => getDocuments(), []);
    const deleteDocumentRequest = React.useCallback(
        () => deleteDocument(documentIdToDelete),
        [documentIdToDelete]
    );

    const [sendRequest, isLoading] = useApi(getDocumentsRequest, {
        onSuccess: (response) => {
            const { documents } = response.data;
            const filteredRes: IDocument[] = [];
            const filteredTrans: IDocument[] = [];
            if (documents.length === 0) {
                snack('No documents were found', 'warning');
            } else {
                documents.forEach((document) => {
                    if (document.type === 'resume') {
                        filteredRes.push(document);
                    } else {
                        filteredTrans.push(document);
                    }
                });
                setResumes(filteredRes);
                setTranscripts(filteredTrans);
            }
        },
    });

    React.useEffect(() => sendRequest(), [sendRequest]);

    const handleChange = () => {
        setChecked(true);
    };

    return isLoading ? (
        <Loader center />
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
                                            color='primary'
                                            checked={resume.isDefault}
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {formatDateString(
                                            new Date(
                                                resume.dateAdded
                                            ).toLocaleDateString()
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DeleteButton
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
                                            color='primary'
                                            onClick={handleChange}
                                            checked={transcript.isDefault}
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {formatDateString(
                                            transcript.dateAdded.toString()
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DeleteButton
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
                        sendRequest();
                    }}
                />
            </uploadDialog.Dialog>
        </Grid>
    );
}

export default Documents;
