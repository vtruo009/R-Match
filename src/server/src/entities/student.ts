import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User, IUser } from './user';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    departmentId: string;

    @Column({ nullable: true })
    sid: number;

    @Column({ nullable: true })
    classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior';

    @Column({ nullable: true })
    resume: string; 

    @Column({ nullable: true })
    transcript: string; 

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}

export interface IStudent {
    id: number;
    departmentId?: string;
    sid?: number;
    classStanding?: 'freshman' | 'sophomore' | 'junior' | 'senior';
    resume: string; 
    transcript: string; 
    user: IUser;
}
