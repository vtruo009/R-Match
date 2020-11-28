import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User, IUser } from './user';

@Entity()
export class FacultyMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    departmentId: string;

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
    departmentId: string;
    websiteLink: string;
    office: string;
    title: string;
    user: IUser;
}
