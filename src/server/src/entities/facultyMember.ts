import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User, IUser } from './user';

@Entity()
export class FacultyMember extends User {
    constructor(
        id: number,
        email: string,
        password: string,
        biography: string,
        firstName: string,
        middleName: string,
        lastName: string,
        departmentId: string,
        websiteLink: string,
        office: string,
        title: string
    ) {
        super(id, email, password, biography, firstName, middleName, lastName);
        this.facultyId = id;
        this.departmentId = departmentId;
        this.websiteLink = websiteLink;
        this.office = office;
        this.title = title;
    }

    @PrimaryGeneratedColumn()
    facultyId: number;

    @Column({ nullable: true })
    departmentId: string;

    @Column({ nullable: true })
    websiteLink: string;

    @Column({ nullable: true })
    office: string;

    @Column({ nullable: true })
    title: string;
}

export interface IFacultyMember extends IUser {
    facultyId: number;
    departmentId: string;
    websiteLink: string;
    office: string;
    title: string;
}
