import API from 'api';
import { IDocumentUploadForm } from 'Domains/Documents/DocumentUploadForm'

export const documentType = [
    {
        label: 'Resume',
        value: 'resume'
    },
    {
        label: 'Transcript',
        value: 'transcript'
    }
]

export interface IDocument {
    id: number,
    name: string,
    type: string,
    isDefault: boolean,
    dateAdded: Date,
}

export async function createDocument(document: IDocumentUploadForm) {
    return API.post('/document/create', {document});
}

// export async function getDocuments(type: string) {
export async function getDocuments() {
    // const params = {
    //     type,
    // };
//    return API.get<{documents: IDocument[]}>('/document/read', { params });
    return API.get<{documents: IDocument[]}>('/document/read');
}