import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';
import { Student } from './student';

export type type = 'resume' | 'transcript';
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
    type: type;

    @Column({ nullable: false })
    isDefault: boolean;

    @Column()
    dateAdded: Date;

    @Column({ type: 'bytea', nullable: false })
    data: Buffer;

    @Column()
    studentId: number;

    @ManyToOne(() => Student, (student) => student.documents)
    public student: Student;
}
