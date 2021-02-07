import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';
import { Student } from './student';

export type docType = 'resume' | 'transcript';
@Entity()
export class Document extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ['resume', 'transcript'],
    })
    docType: docType;

    @Column({ nullable: true })
    isDefault: boolean;

    @Column({ nullable: true}) //should false
    dateAdded: Date;

    @Column({ type: 'bytea', nullable: false })
    document: Buffer;

    @Column()
    studentId: number;

    @ManyToOne(() => Student, (student) => (student.documents))
    public student: Student;
}