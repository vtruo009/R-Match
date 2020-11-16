import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './person';

@Entity()
export class FacultyMember extends Person {
    constructor(id: number, email: string, biography: string,
        firstName: string, middleName: string, lastName: string,
        departmentId: string, websiteLink: string,
        office: string, title: string) {
        super(id, email, biography, firstName, middleName, lastName);
        this.facultyId = id;
        this.departmentId = departmentId;
        this.websiteLink = websiteLink;
        this.office = office;
        this.title = title;
    }

    @PrimaryGeneratedColumn()
    facultyId: number;

    @Column()
    departmentId: string;

    @Column()
    websiteLink: string;

    @Column()
    office: string;

    @Column()
    title: string;
}

export interface IFacultyMember {
    id: number;
    email: string;
    biography: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    departmentId: string;
    websiteLink: string;
    office: string;
    title: string;
}
