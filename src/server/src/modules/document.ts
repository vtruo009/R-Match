import { UpdateResult } from 'typeorm';
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

    if (isDefault) {
        // Make current default document for the respective type as non-default
        await Document.update(
            { studentId, isDefault: true, type },
            { isDefault: false }
        );
    }

    // Find number of documents of the type provided
    const countOfStudentDocuments = await Document.count({
        where: { studentId, type },
    });

    const documentToInsert = await Document.create({
        name,
        type,
        // if students has no documents of the provided type then make this new document the default one
        isDefault: countOfStudentDocuments === 0 ? true : isDefault,
        dateAdded: new Date(),
        data: Buffer.from(data, 'base64'),
        studentId,
    }).save();

    insertResult.result = documentToInsert;
    insertResult.message = 'Document successfully uploaded';
    return insertResult;
};

export const getDefaultDocuments = (studentId: Document['studentId']) => {
    return Document.find({ where: { studentId, isDefault: true } });
};

export const markDocumentAsDefault = async (
    documentId: Document['id'],
    type: Document['type'],
    studentId: Document['studentId']
) => {
    const updateResult: { result?: UpdateResult; message: string } = {
        result: undefined,
        message: '',
    };

    const student = await Student.findOne(studentId);
    if (!student) {
        updateResult.message = 'Student does not exist';
        return updateResult;
    }

    const documentToUpdate = await Document.findOne(documentId, {
        select: ['studentId'],
    });

    if (documentToUpdate?.studentId !== studentId) {
        updateResult.message = 'Student is not owner of the document';
        return updateResult;
    }

    // Set previous default document as non-default
    await Document.update(
        { studentId, type, isDefault: true },
        { isDefault: false }
    );

    // set specified document as the default one
    const result = await Document.update(documentId, { isDefault: true });
    const { affected } = result;

    // if affected is 0 then document does not exist or it could not be updated
    if (affected && affected === 0) {
        updateResult.message = 'Document could not be marked as default';
        return updateResult;
    }

    updateResult.result = result;
    updateResult.message = 'Document successfully marked as default';
    return updateResult;
};
/**
 * @description Gets all the documents of a particular student
 * @param {number} studentId - Id of the student
 * @returns Promise
 */
export const getDocuments = async (studentId: Student['id']) => {
    const student = await Student.findOne(studentId);
    if (!student) return undefined;
    const documents = await Document.find({
        where: { studentId: studentId },
        select: ['dateAdded', 'isDefault', 'id', 'name', 'type'],
    });

    const resumes = documents.filter((document) => document.type === 'resume');
    const transcripts = documents.filter(
        (document) => document.type === 'transcript'
    );

    return { resumes, transcripts };
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
