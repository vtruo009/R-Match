import { colleges } from './data';
import { createCollege, getColleges } from '@modules/college';
import { createDepartment } from '@modules/department';
import { createCourse } from '@modules/course';

// Saves college and respective departments data into the database
export const seedData = async () => {
    // TODO: Not bet practice as every time the server is restarted we are fetching all college
    //       entries from the debatable. A better approach would be to seed the database on start
    //       using TypeORM migrations!
    const existingColleges = (await getColleges()).map(
        (college) => college.name
    );

    for (const { name, departments } of colleges) {
        if (!existingColleges.includes(name)) {
            const collegeResult = await createCollege(name);
            for (const { name, courses } of departments) {
                const departmentResult = await createDepartment(
                    name,
                    collegeResult.id
                );
                if (!departmentResult) continue;
                for (const { shortTitle, fullTitle } of courses) {
                    await createCourse(
                        shortTitle,
                        fullTitle,
                        departmentResult.id
                    );
                }
            }
        }
    }
};
