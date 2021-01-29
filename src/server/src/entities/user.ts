import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Message } from './message';
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

    @OneToMany(() => Message, (message) => message.sender)
    public sentMessages: Message[];

    @OneToMany(() => Message, (message) => message.receiver)
    public receivedMessages: Message[];
}

export interface JWTUser {
    userId: number;
    specificUserId: number;
    role: role;
    firstName: string;
    lastName: string;
}
