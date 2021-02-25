import { Document } from '@entities/document';
import { Student } from '@entities/student';

/**
 * @description Creates a new document. Assigns relationship with student table
 * @param {string} name - Name of document
 * @param {string} type - Type of document
 * @param {boolean} isDefault - Default document that student uses to apply to jobs
 * @param {string} data - data of the document in bas64 string format
 * @param {number} studentId - Id of student owner of the document
 * @returns Promise
 */
export const createDocument = async (
    name: Document['name'],
    type: Document['type'],
    isDefault: Document['isDefault'],
    data: string, //base64 pdf data
    studentId: Document['studentId']
) => {
    const insertResult: { result?: Document; message: string } = {
        result: undefined,
        message: '',
    };

    const studentToUpdate = await Student.findOne({
        where: { id: studentId },
    });

    if (!studentToUpdate) {
        insertResult.message =
            'Student that uploaded the document no longer exists';
        return insertResult;
    }

    const documentToInsert = await Document.create({
        name,
        type,
        isDefault,
        dateAdded: new Date(),
        data: Buffer.from(data, 'base64'),
        studentId,
    }).save();

    insertResult.result = documentToInsert;
    insertResult.message = 'Document successfully uploaded';
    return insertResult;
};

/**
 * @description Gets all the documents of a particular student
 * @param {number} studentId - Id of the student
 * @returns Promise
 */
export const getDocuments = async (studentId: Student['id']) => {
    const student = await Student.findOne(studentId);
    if (!student) return undefined;
    return Document.find({
        where: { studentId: studentId },
        select: ['dateAdded', 'isDefault', 'id', 'name', 'type'],
    });
};

/**
 * @description Delete an uploaded document from the database
 * @param {number} id - Id of the document to delete
 * @returns Promise
 */
export const deleteDocument = (id: Document['id']) => {
    return Document.delete(id);
};

/**
 * @description Gets all the documents of a particular student
 * @param {number} studentId - Id of the student
 * @returns Promise
 */
export const getDocumentData = async (documentId: Document['id']) => {
    const document = await Document.findOne(documentId);
    if (document) return document.data.toString('base64');
};
