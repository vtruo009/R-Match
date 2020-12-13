import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    biography: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    middleName: string;

    @Column()
    role: 'student' | 'facultyMember';
}

export interface IUser {
    id: number;
    email: string;
    password: string;
    biography?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    role: 'student' | 'facultyMember';
}

export interface JWTUser {
    userId: number;
    role: 'student' | 'facultyMember';
    firstName: string;
    lastName: string;
}

export interface JWTStudent extends JWTUser {
    studentId: number;
}

export interface JWTFacultyMember extends JWTUser {
    facultyMemberId: number;
}
