import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './person';

@Entity()
export class Student extends Person {
    constructor(id: number, email: string, biography: string,
        firstName: string, middleName: string, lastName: string,
        departmentId: string, sid: number,
        classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior') {
        super(id, email, biography, firstName, middleName, lastName);
        this.studentId = id;
        this.departmentId = departmentId;
        this.sid = sid;
        this.classStanding = classStanding;
    }
    @PrimaryGeneratedColumn()
    studentId: number;

    @Column()
    departmentId: string;

    @Column()
    sid: number;

    @Column()
    classStanding: string;
}

export interface IStudent {
    id: number;
    email: string;
    biography: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    departmentId: string;
    sid: number;
    classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior';
}
