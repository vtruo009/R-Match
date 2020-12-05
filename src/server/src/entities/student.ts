import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User, IUser } from './user';
import { HasTaken } from './hasTaken';

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

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(() => HasTaken, hasTaken => hasTaken.student)
    hasTaken: HasTaken[]
}

export interface IStudent {
    id: number;
    departmentId?: string;
    sid?: number;
    classStanding?: 'freshman' | 'sophomore' | 'junior' | 'senior';
    user: IUser;
}
