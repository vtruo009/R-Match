import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    biography?: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    middleName?: string;

    @Column()
    role: 'student' | 'facultyMember';
}

export interface JWTUser {
    userId: number;
    specificUserId: number;
    role: 'student' | 'facultyMember';
    firstName: string;
    lastName: string;
}
