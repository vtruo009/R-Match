import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
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
