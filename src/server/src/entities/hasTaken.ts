import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import { Student } from './student';

@Entity()
export class HasTaken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courseId: string;

    @ManyToOne(() => Student, student => student.hasTaken)
    student: Student;
}

export interface IHasTaken {
    id: number;
    courseId: string;
    studentId: number;
}
