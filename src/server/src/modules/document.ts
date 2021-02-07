import { Document } from '@entities/document';
import { Student } from '@entities/student';
import { getRepository, UpdateResult } from 'typeorm';

/* find a student by id? */
/**
 * @description Find a student byt id
 * @param {number} id - id of student to find
 * @returns Promise
 */
export const findStudent = (id: Student['id']) => {
    return Document.findOne(id);
};

/**
 * @description Creates a new file. Assigns relationships with student tables
 * @param name - Name of document
 * @param isDefault - Default document that student uses to apply to jobs
 * @param dateAdded - The date the document was added (probably won't need as a param because it will always be today. The user doens't have to input the date)
 * @param document - Binary data of the file/document
 * @returns Promise
 */
export const createDocument = async (
    name: Document['name'],
    docType: Document['docType'],
    isDefault: Document['isDefault'],
    document: Document['document'],
    studentId: Document['studentId']
) => {
    const insertResult: { result?: Document; message: string } = {
        result: undefined,
        message: '',
    };

    const docName = name + '.pdf';
    const dateAddedAsDate = new Date(); //today
    const studentRepository = getRepository(Student);

    const studentToUpdate = await studentRepository.findOne({
        where: { id: studentId },
    });
    if (!studentToUpdate) {
        insertResult.message =
            'Student that uploaded the document does not exist';
        return insertResult;
    }

    const documentToInsert = await Document.create({
        name: docName,
        docType,
        isDefault,
        dateAdded: dateAddedAsDate,
        document,
        studentId,
    }).save();

    insertResult.result = documentToInsert;
    insertResult.message = 'Document successully uploaded';
    return insertResult;
};

/**
 * @description Get all the documents of this user (student)
 * @param {number} studentId - Id of the student
 * @returns Promise
 */

export const getDocuments = async (studentId: number) => {
    const student = await Student.findOne(studentId);
    if (!student) return undefined;

    return getRepository(Document)
        .createQueryBuilder('document')
        // .select([
        //     'document',
        //     'document.student',
        //     'document.name',
        //     'document.isDefault',
        //     'document.dateAdded',
        // ])
        .where({ studentId: studentId })
        .getMany();
};

 /**
  * @description Delete an uploaded document from the database
  * @param {number} id - Id of the document to delete
  * @returns Promise
  */
export const deleteDocument = (id: Document['id']) => {
    return Document.delete(id);
};