import { MigrationInterface, QueryRunner } from 'typeorm';
import { colleges } from '@db/data';
import { createCollege } from '@modules/college';
import { createDepartment } from '@modules/department';
import { createCourse } from '@modules/course';

export class seedData1610848423630 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const { name, departments } of colleges) {
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
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
