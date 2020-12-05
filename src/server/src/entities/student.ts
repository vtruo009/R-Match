import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    ManyToOne
} from 'typeorm';
import { User, IUser } from './user';
import { Department } from './department';
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
    user: IUser;
    courses?: Course[];
}
