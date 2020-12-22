import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    BaseEntity,
} from 'typeorm';
import { Student } from './student';
import { Department } from './department';

@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    shortTitle: string;

    @Column()
    fullTitle: string;

    @Column()
    departmentId: number;

    @ManyToOne(() => Department, (department) => department.courses)
    department: Department;

    @ManyToMany(() => Student, (student) => student.courses)
    students: Student[];
}
