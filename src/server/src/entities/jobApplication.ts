import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from '../entities/student';
import { Job } from '../entities/job';

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public date: Date;

    @ManyToOne(type => Job, job => job.jobApplications)
    public job: Job;

    @ManyToOne(type => Student, student => student.jobApplications)
    public student: Student;
}