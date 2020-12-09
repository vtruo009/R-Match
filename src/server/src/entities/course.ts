import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany
} from 'typeorm';
import { Student } from '../entities/student';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToMany(() => Student, student => student.courses)
    students: Student[];
}

export interface ICourse {
    id: number;
    title: string;
    students: Student[];
}
