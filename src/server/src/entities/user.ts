import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';

import { Message } from './message';

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

    @OneToMany(() => Message, (message) => message.sender)
    public sentMessages: Message[];

    @OneToMany(() => Message, (message) => message.receiver)
    public receivedMessages: Message[];
}

export interface JWTUser {
    userId: number;
    specificUserId: number;
    role: 'student' | 'facultyMember';
    firstName: string;
    lastName: string;
}
