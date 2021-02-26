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
    type: 'resume' | 'transcript';
    isDefault: boolean;
    dateAdded: string;
}

export async function createDocument(
    name: IDocument['name'],
    type: IDocumentUploadForm['type'],
    isDefault: IDocumentUploadForm['isDefault'],
    data: string
) {
    return API.post('/document/create', {
        document: { name, type, isDefault, data },
    });
}

export async function getDocuments() {
    return API.get<{
        documents: { resumes: IDocument[]; transcripts: IDocument[] };
    }>('/document/read');
}

export async function getDocumentData(documentId: IDocument['id']) {
    return API.get<{ documentData: string }>(
        `/document/get-data/${documentId}`
    );
}

export async function deleteDocument(documentId: IDocument['id']) {
    return API.delete(`/document/delete/${documentId}`);
}

export async function markDocumentAsDefault(
    documentId: IDocument['id'],
    studentId: number,
    type: IDocument['type']
) {
    return API.put(
        `/document/mark-as-default/${documentId}/${studentId}/${type}`
    );
}
