import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class Person {
    constructor(id: number, email: string, biography: string,
        firstName: string, middleName: string, lastName: string) {
        this.personId = id;
        this.email = email;
        this.biography = biography;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
    }

    @PrimaryGeneratedColumn()
    personId: number;

    @Column()
    email: string;

    @Column()
    biography: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    middleName: string;
}

export interface IPerson {
    id: number;
    email: string;
    biography: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}
