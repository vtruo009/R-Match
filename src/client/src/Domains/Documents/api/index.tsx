import API from 'api';
import { IDocumentUploadForm } from 'Domains/Documents/DocumentUploadForm';

export const documentType = [
    {
        label: 'Resume',
        value: 'resume',
    },
    {
        label: 'Transcript',
        value: 'transcript',
    },
];

export interface IDocument {
    id: number;
    name: string;
    type: string;
    isDefault: boolean;
    dateAdded: Date;
}

export async function createDocument(
    name: string,
    type: IDocumentUploadForm['type'],
    isDefault: IDocumentUploadForm['isDefault'],
    data: string
) {
    return API.post('/document/create', {
        document: { name, type, isDefault, data },
    });
}

export async function getDocuments() {
    return API.get<{ documents: IDocument[] }>('/document/read');
}

export async function getDocumentData(documentId: number) {
    return API.get<{ documentData: string }>(
        `/document/get-data/${documentId}`
    );
}

export async function deleteDocument(documentId: number) {
    return API.delete(`/document/delete/${documentId}`);
}
