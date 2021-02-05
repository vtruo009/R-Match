import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';
import { Student } from './student';

@Entity()
export class Document extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    isDefault: boolean;

    @Column({ nullable: false})
    dateAdded: Date;

    @Column({ type: 'bytea', nullable: false })
    document: Buffer;

    @ManyToOne(() => Student, (student) => (student.documents))
    public student: Student;
}