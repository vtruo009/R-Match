import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { College } from './college';
import { Job } from './job';
import { Course } from './course';

@Entity()
export class Department extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    collegeId: number;

    @ManyToOne(() => College, (college) => college.departments, {
        onDelete: 'CASCADE',
    })
    college: College;

    @OneToMany(() => Job, (job) => job.department)
    jobs: Job[];

    @OneToMany(() => Course, (course) => course.department)
    courses: Course[];
}
