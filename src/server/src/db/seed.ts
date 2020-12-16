import { colleges } from './data';
import { createCollege, getColleges } from '@modules/college';
import { createDepartment } from '@modules/department';

// Saves college and respective departments data into the database
export const seedData = async () => {
    // TODO: Not bet practice as every time the server is restarted we are fetching all college entries from the debatable
    //      A better approach would be to seed the database on start using TypeORM migrations!
    const existingColleges = (await getColleges()).map(
        (college) => college.name
    );
    colleges.forEach(async ({ name, departments }) => {
        if (!existingColleges.includes(name)) {
            const collegeResult = await createCollege(name);
            departments.forEach(async (department) => {
                await createDepartment(department, collegeResult);
            });
        }
    });
};
