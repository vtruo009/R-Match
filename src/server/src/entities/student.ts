import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    JoinTable,
    OneToOne,
    OneToMany,
    ManyToMany,
    ManyToOne,
    BaseEntity,
} from 'typeorm';
import { User } from './user';
import { Course } from './course';
import { Department } from './department';
import { JobApplication } from './jobApplication';

@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    departmentId?: number;

    @ManyToOne(() => Department, { nullable: true })
    department?: Department;

    @Column({ nullable: true })
    sid?: number;

    @Column({ nullable: true })
    classStanding?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

    @Column()
    userId: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToMany(() => Course, (course) => course.students)
    @JoinTable()
    courses: Course[];

    @OneToMany(() => JobApplication, (jobApplication) => jobApplication.student)
    public jobApplications: JobApplication[];
}
