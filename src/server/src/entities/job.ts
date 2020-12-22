import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { FacultyMember } from './facultyMember';
import { JobApplication } from './jobApplication';
import { Department } from './department';

@Entity()
export class Job extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-array')
    targetYears: string[];

    @Column()
    hoursPerWeek: number;

    @Column()
    description: string;

    @Column()
    expirationDate?: Date;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column()
    postedOn: Date;

    @Column('simple-array')
    type: string[];

    @Column()
    title: string;

    @Column()
    status: 'Hiring' | 'Closed';

    @Column()
    minSalary: number;

    @Column({ nullable: true })
    maxSalary?: number;

    @Column()
    departmentId: number;

    @ManyToOne(() => Department, (department) => department.jobs)
    department: Department;

    @Column()
    facultyMemberId: number;

    @ManyToOne(() => FacultyMember, (facultyMember) => facultyMember.jobs)
    facultyMember: FacultyMember;

    @OneToMany(() => JobApplication, (jobApplication) => jobApplication.job)
    public jobApplications: JobApplication[];
}
