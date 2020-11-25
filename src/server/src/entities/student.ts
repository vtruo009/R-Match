import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User, IUser } from './user';

@Entity()
export class Student extends User {
    constructor(
        id: number,
        email: string,
        password: string,
        biography: string,
        firstName: string,
        middleName: string,
        lastName: string,
        departmentId: string,
        sid: number,
        classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior'
    ) {
        super(id, email, password, biography, firstName, middleName, lastName);
        this.studentId = id;
        this.departmentId = departmentId;
        this.sid = sid;
        this.classStanding = classStanding;
    }
    @PrimaryGeneratedColumn()
    studentId: number;

    @Column({ nullable: true })
    departmentId: string;

    @Column({ nullable: true })
    sid: number;

    @Column({ nullable: true })
    classStanding: string;
}

export interface IStudent extends IUser {
    studentId: number;
    departmentId: string;
    sid: number;
    classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior';
}
