import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class User {
    constructor(
        id: number,
        email: string,
        password: string,
        biography: string,
        firstName: string,
        middleName: string,
        lastName: string
    ) {
        this.userId = id;
        this.email = email;
        this.password = password;
        this.biography = biography;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
    }

    @PrimaryGeneratedColumn()
    userId: number;

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
}

export interface IUser {
    userId: number;
    email: string;
    password: string;
    biography: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}
