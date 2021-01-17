import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export type role = 'student' | 'facultyMember';

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

    @Column({
        type: 'enum',
        enum: ['student', 'facultyMember'],
    })
    role: role;
}

export interface JWTUser {
    userId: number;
    specificUserId: number;
    role: role;
    firstName: string;
    lastName: string;
}
