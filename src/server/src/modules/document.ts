import { Document } from '@entities/document';
import { Student } from '@entities/student';
import { UpdateResult } from 'typeorm';

/**
 * @description Find a student byt id
 * @param {number} id - id of student to find
 * @returns Promise
 */

/**
 * @description Creates a new document. Assigns relationship with student tables
 * @param name - Name of document
 * @param isDefault - Default document that student uses to apply to jobs
 * @param document - Binary data of the file/document
 * @returns Promise
 */
export const createDocument = async (
    name: Document['name'],
    type: Document['type'],
    isDefault: Document['isDefault'],
    document: Document['document'],
    studentId: Document['studentId']
) => {
    const insertResult: { result?: Document; message: string } = {
        result: undefined,
        message: '',
    };

    const docName = name + '.pdf';

    const studentToUpdate = await Student.findOne({
        where: { id: studentId },
    });
    if (!studentToUpdate) {
        insertResult.message =
            'Student that uploaded the document no longer exists';
        return insertResult;
    }

    const documentToInsert = await Document.create({
        name: docName,
        type,
        isDefault,
        dateAdded: new Date(),
        document,
        studentId,
    }).save();

    insertResult.result = documentToInsert;
    insertResult.message = 'Document successully uploaded';
    return insertResult;
};

/**
 * @description Gets all the documents of this user (student)
 * @param {number} studentId - Id of the student
 * @returns Promise
 */

export const getDocuments = async (studentId: number) => {
    const student = await Student.findOne(studentId);
    if (!student) return undefined;

    return await Document.find({ where: { studentId: studentId } });
};

 /**
  * @description Update the properties of an existing/uploaded document
  * @param {number} id - Id of the document that is to be updated
  * @param {string} name - New name of the document
  * @param {string} type - New type of the document
  * @param {boolean} isDefault - New default status of the document
  * @returns Promise
  */
 export const updateDocument = async (document: Document) => { //does it need to be async?
    const {
        id,
        name,
        type,
        isDefault,
    } = document;

    const updateResult: {
        result?: UpdateResult;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const updatedDocument = await Document.update(id, { //does it need to await?
        name,
        type,
        isDefault,
    });

    updateResult.result = updatedDocument;
    updateResult.message = 'Document successfully updated';
    return updateResult;
};


 /**
  * @description Delete an uploaded document from the database
  * @param {number} id - Id of the document to delete
  * @returns Promise
  */
export const deleteDocument = async (id: Document['id']) => {
    return Document.delete(id);
};