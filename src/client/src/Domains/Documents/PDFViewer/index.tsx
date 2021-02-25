import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import DeleteButton from 'Components/DeleteButton';
import testPDF from 'static/images/project-rt.pdf';
import {
    IDocument,
    deleteDocument
} from 'Domains/Documents/api';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
    document: IDocument;
    onSubmit: () => void;
}

function PDFViewer(
    {
        document,
        onSubmit,
}: PDFViewerProps
) {
    const getDocumentNameForDelete = () => {
        // const { name } = document;
        // return `Please confirm the deletion of the document "${name}.`
        return 'Please confirm that you want to delete this document.';
    };
    const deleteRequest = React.useCallback(() => deleteDocument(13), [13]);
    return (
        <div>
            {/* <Document
                file={{
                    data: document
                }}
                onLoadError={console.error}
            >
                <Page pageNumber={1} />
            </Document> */}
            <h2>{document.id}</h2>
            <DeleteButton
                message='Are you sure you want to delete this resume?'
                onDeleteRequest={deleteRequest}
                onSuccess={() => onSubmit()}
            />
        </div>
    );
}


export default PDFViewer;

// I need the document id in here so I can call deleteDocument with id