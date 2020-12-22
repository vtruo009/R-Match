import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity} from 'typeorm';
import { Student } from '../entities/student';
import { Job } from '../entities/job';

@Entity()
export class JobApplication extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public date: Date;

    @Column()
    public jobId: number;

    @ManyToOne(() => Job, (job) => job.jobApplications)
    public job: Job;

    @Column()
    public studentId: number;

    @ManyToOne(() => Student, (student) => student.jobApplications)
    public student: Student;
}
