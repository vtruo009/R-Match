import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { User, IUser } from './user';
import { Department } from './department';

@Entity()
export class FacultyMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Department, { nullable: true })
    department: Department;

    @Column({ nullable: true })
    websiteLink: string;

    @Column({ nullable: true })
    office: string;

    @Column({ nullable: true })
    title: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}

export interface IFacultyMember {
    id: number;
    department?: Department;
    websiteLink?: string;
    office?: string;
    title?: string;
    user: IUser;
}
