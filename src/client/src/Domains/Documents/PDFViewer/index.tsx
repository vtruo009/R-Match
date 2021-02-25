import React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { ProgressBar } from '@react-pdf-viewer/core';

import Grid from '@material-ui/core/Grid';

import Loader from 'Components/Loader';
import useApi from 'hooks/useApi';
import { getDocumentData } from '../api';

interface PDFViewerProps {
    documentId: number;
}

function PDFViewer({ documentId }: PDFViewerProps) {
    const [documentData, setDocumentData] = React.useState<string>();

    const base64toBlob = (data: string) => {
        const base64WithoutPrefix = data.substr(
            'dataapplication/pdfbase64'.length
        );
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
        return new Blob([out], { type: 'application/pdf' });
    };

    const getDocumentDataRequest = React.useCallback(
        () => getDocumentData(documentId),
        [documentId]
    );

    const [sendRequest, isLoading] = useApi(getDocumentDataRequest, {
        onSuccess: (response) => {
            const { documentData } = response.data;
            const blob = base64toBlob(documentData + '=');
            setDocumentData(URL.createObjectURL(blob));
        },
    });

    React.useEffect(() => {
        sendRequest();
    }, [sendRequest, documentId]);

    return isLoading ? (
        <Grid container justify='center'>
            <Loader />
        </Grid>
    ) : documentData ? (
        <Viewer
            fileUrl={documentData}
            renderLoader={(percentages: number) => (
                <div style={{ width: '240px' }}>
                    <ProgressBar progress={Math.round(percentages)} />
                </div>
            )}
        />
    ) : (
        <> </>
    );
}

export default PDFViewer;
