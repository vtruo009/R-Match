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
import { Document } from './document'

export type classStandings = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    departmentId?: number;

    @ManyToOne(() => Department, { nullable: true })
    department?: Department;

    @Column({ nullable: true })
    sid?: string;

    @Column({
        nullable: true,
        type: 'enum',
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
    })
    classStanding?: classStandings;

    @Column({ type: 'bytea', nullable: true })
    resume: Buffer;

    @Column({ type: 'bytea', nullable: true })
    transcript: Buffer;

    @OneToOne(() => User, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @Column()
    userId: number;

    @ManyToMany(() => Course, (course) => course.students)
    @JoinTable()
    courses: Course[];

    @OneToMany(() => JobApplication, (jobApplication) => jobApplication.student)
    public jobApplications: JobApplication[];

    @OneToMany(() => Document, (documents) => documents.student)
    public documents: Document[];
}
