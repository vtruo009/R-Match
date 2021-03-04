import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from 'typeorm';
import { Student } from '../entities/student';

@Entity()
export class WorkExperience extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column()
    employer: string;

    @Column()
    title: string;

    @Column()
    studentId: number;

    @ManyToOne(() => Student, (student) => student.workExperiences)
    public student: Student;
}