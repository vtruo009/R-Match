import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { FacultyMember } from './facultyMember';
import { JobApplication } from './jobApplication';
import { Department } from './department';

@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;
}
