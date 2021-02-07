import { WorkExperience } from '@entities/workExperience'
import { Student } from '@entities/student'
import { getRepository, UpdateResult } from 'typeorm'

/**
 * @description Finds a work experience by id
 * @param {number} id - Id of work experience to find
 * @returns Promise
 */
export const findWorkExperience = (id: WorkExperience['id']) => {
    return WorkExperience.findOne(id);
};

/**
 * @description Saves a new work experience. Assigns relationships with student table.
 * @param {Date} startDate - Start date of the work experience
 * @param {Date} endDate - End date of the work experience
 * @param {string} title - Title of the work experience
 * @param {string} employer - Name of the employer for the work experience
 * @param {string} description - Description for the work experience
 * @param {number} studentId - ID of the student that added the workk experience
 * @returns Promise
 */

export const addWorkExperience = async (
    startDate: WorkExperience['startDate'],
    endDate: WorkExperience['endDate'],
    title: WorkExperience['title'],
    employer: WorkExperience['employer'],
    description: WorkExperience['description'],
    studentId: WorkExperience['studentId'],
    ) => {
        const insertResult: { result?: WorkExperience; message: string } = {
            result: undefined,
            message: '',
        };
        
        const startDateAsDate = new Date(startDate);

        let endDateAsDate;
        if (endDate) {
            endDateAsDate = new Date(endDate);
        }

        const today = new Date(); 
        const studentRepository = getRepository(Student);

        const studentToUpdate = await studentRepository.findOne({
            where: { id: studentId },
        });
        if (!studentToUpdate) {
            insertResult.message = 
        'Student that posted the work experience does not exist';
            return insertResult; 
            }
            
        const workExperiencetoInsert = await WorkExperience.create({
            startDate: startDateAsDate,
            endDate: endDateAsDate,
            title,
            employer,
            description,
            studentId,
       }).save();

       insertResult.result
       insertResult.message = 'Work experience sucessfully inserted'
        };

export const getWorkExperiences = (
    title: string,
    types: string[],
    startDate: string,
    minSalary: number,
    hoursPerWeek: number,
    page: number,
    numOfItems: number
    ) => {
        let modType = 'none';
        let modStart;
        if (types) {
            modType = types.join(',');
        }
        if (startDate) {
            modStart = new Date(startDate);
            let month = modStart.getMonth() + 1;
            let date = modStart.getDate();
            let year = modStart.getFullYear();
            modStart = month + '/' + date + '/' + year;
        }
        return (
            getRepository(WorkExperience)
                .createQueryBuilder('workExperience')
                .select([
                    'workExperience',
                    'workExperience.student',
                    'student.id',
                    'user.firstName',
                    'user.lastName',
                 ])
                .leftJoin('workExperience.student', 'student')
                .leftJoin('student.user', 'user')
                .where('LOWER(workExperience.title) LIKE :title', {
                    title: `%${title.toLowerCase()}%`,
                })
                .orWhere('workExperience.type IN (:...types)', { types })
                .orWhere('workExperience.type LIKE :type', { type: `%${modType}%` })
                .orWhere('workExperience.startDate >= :startDate', { startDate: modStart })
                .take(numOfItems)
                .getManyAndCount()
        );
    };
/**
 * @description Updates the properties of an already existing work experience.
 * @param {WorkExperience} workExperience - Work experience object storing the fields to update
 * @param {string} workExperience.description - New description of the work experience
 * @param {string} workExperience.employer - New employer of the work experience
 * @param {Date} workExperience.startDate - New start date of the work experience
 * @param {Date} workExperience.endDate - New end date of the work experience
 * @param {string} workExperience.title - New title of the work experience
 * @param {number} workExperience.id - Id of the work experience to update
 * @returns Promise
 */

export const updateWorkExperience = async (workExperience: WorkExperience) => {
    const {
        description,
        employer,
        startDate,
        endDate,
        title,
        id,
    } = workExperience;

    const updateResult: {
        result?: UpdateResult;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const startDateAsDate = new Date(startDate);
    let endDateAsDate;
    if (endDate) {
        endDateAsDate = new Date(endDate);
    }
    const updatedWorkExperience = await WorkExperience.update(id, {
        description,
        employer,
        startDate: startDateAsDate,
        endDate: endDateAsDate,
        title,
    });
    updateResult.result = updatedWorkExperience;
    updateResult.message = 'Work experience successfully updated';
    return updateResult;
};

/**
 * @description Deletes an existing work experience from the database
 * @param {number} id - Id of work experience to delete
 * @returns Promise
 */
export const deleteWorkExperience = (id: WorkExperience['id']) => {
    return WorkExperience.delete(id);
};
