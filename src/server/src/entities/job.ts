import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { FacultyMember } from './facultyMember';
import { JobApplication } from './jobApplication';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-array')
    targetYears: string[];

    @Column()
    hoursPerWeek: number;

    @Column()
    description: string;

    @Column()
    expirationDate: Date;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

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

    @Column()
    maxSalary: number;

    @Column()
    departmentId: string;

    @ManyToOne(() => FacultyMember, (facultyMember) => facultyMember.jobs)
    facultyMember: FacultyMember;

    @OneToMany(type => JobApplication, jobApplication => jobApplication.job)
    public studentToJob: JobApplication[];
}

export interface IJob {
    id: number;
    targetYears: string[];
    hoursPerWeek: number;
    description: string;
    expirationDate?: string;
    startDate: string;
    endDate?: string;
    postedOn: string;
    type: string[];
    title: string;
    status: 'Hiring' | 'Closed';
    minSalary: number;
    maxSalary?: number;
    departmentId: string;
    facultyMember: FacultyMember;
}
