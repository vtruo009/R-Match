import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    ManyToOne
} from 'typeorm';
import { User, IUser } from './user';
import { Course } from './course';
import { Department } from './department';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Department, { nullable: true })
    department: Department;

    @Column({ nullable: true })
    sid: number;

    @Column({ nullable: true })
    classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior';

    @Column({ nullable: true })
    resume: File; 

    @Column({ nullable: true })
    transcript: File; 

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToMany(() => Course, course => course.students)
    @JoinTable()
    courses: Course[];
}

export interface IStudent {
    id: number;
    department?: Department;
    sid?: number;
    classStanding?: 'freshman' | 'sophomore' | 'junior' | 'senior';
    resume?: File; 
    transcript?: File; 
    user: IUser;
    courses?: Course[];
}
