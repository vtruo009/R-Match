import React from 'react';
import testPDF from 'static/images/project-rt.pdf';
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
    Checkbox,
} from '@material-ui/core';
import Button from 'Components/Button';
import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import DocumentUploadForm, {
    IDocumentUploadForm,
} from 'Domains/Documents/DocumentUploadForm/index';
import { IDocument, getDocuments } from 'Domains/Documents/api';
import { formatDateString } from 'utils/format';
import PDFViewer from 'Domains/Documents/PDFViewer';

//create initial file initial values here
const fileInitialValues: IDocumentUploadForm = {
    name: '',
    type: '',
    isDefault: false,
    dateAdded: '',
    document: Buffer.alloc(0),
};

export interface DocumentProps {
    name: JSX.Element | string;
    type: string;
    isDefault: boolean;
    dateAdded: string; //change to Date later
    document: Buffer;
}

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
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
    const pdfDialog = useDialog();
    const [resumes, setResumes] = React.useState<IDocument[]>([]);
    const [transcripts, setTranscripts] = React.useState<IDocument[]>([]);
    const [checked, setChecked] = React.useState(false);

    const request = React.useCallback(() => getDocuments(), []);

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const documents = response.data.documents;
            let filteredRes: IDocument[] = [];
            let filteredTrans: IDocument[] = [];
            // console.log(documents);
            documents.forEach((document) => {
                if (document.type === 'resume') {
                    console.log(Buffer.from(document.document.data));
                    console.log(Buffer.from(JSON.stringify(document.document)));
                    // console.log(new Uint8Array(document.document));
                    filteredRes.push(document);
                } else {
                    filteredTrans.push(document);
                }
            });

            setResumes(filteredRes);
            setTranscripts(filteredTrans);
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);

    const handleChange = () => {
        setChecked(true);
    };

    return (
        <div>
            <Typography variant='h4' style={{ marginBottom: 10 }}>
                Resumes
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead style={{ backgroundColor: 'gainsboro' }}>
                        <TableRow>
                            <TableCell align='justify' style={{ width: '75%' }}>
                                Name
                            </TableCell>
                            <TableCell align='center'>Default</TableCell>
                            <TableCell align='center'>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumes.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell onClick={pdfDialog.openDialog}>
                                    {row.name}
                                </TableCell>
                                <TableCell align='center'>
                                    <Checkbox color='primary'></Checkbox>
                                </TableCell>
                                <TableCell align='center'>
                                    {formatDateString(
                                        new Date(
                                            row.dateAdded
                                        ).toLocaleDateString()
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography
                variant='h4'
                style={{ marginBottom: 10, marginTop: 100 }}
            >
                Transcripts
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead style={{ backgroundColor: 'gainsboro' }}>
                        <TableRow>
                            <TableCell align='justify' style={{ width: '75%' }}>
                                Name
                            </TableCell>
                            <TableCell align='center'>Default</TableCell>
                            <TableCell align='center'>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transcripts.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell onClick={pdfDialog.openDialog}>
                                    {row.name}
                                </TableCell>
                                <TableCell align='center'>
                                    <Checkbox
                                        color='primary'
                                        onClick={handleChange}
                                        //checked={checked}
                                        disabled={
                                            row.isDefault !== true && !checked
                                        }
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    {formatDateString(row.dateAdded.toString())}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <pdfDialog.Dialog
                    {...pdfDialog.DialogProps}
                    title='File Viewer'
                >
                    <PDFViewer />
                </pdfDialog.Dialog>
            </TableContainer>

            {/* <Document
                file={testPDF}
                onLoadError={console.error}
            >
                <Page pageNumber={1} />
            </Document> */}

            <Button
                style={{
                    float: 'right',
                    marginTop: 100,
                    marginBottom: 100,
                    marginRight: 35,
                }}
                onClick={uploadDialog.openDialog}
            >
                Add a Document
            </Button>
            <uploadDialog.Dialog
                {...uploadDialog.DialogProps}
                title='Add a Document'
            >
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
