import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { FacultyMember } from './facultyMember';
import { User } from './user';
import { JobApplication } from './jobApplication';
import { Department } from './department';

@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    public senderId: number;

    @ManyToOne(() => User, (user) => user.sentMessages)
    public sender: User;

    @Column()
    public receiverId: number;

    @ManyToOne(() => User, (user) => user.receivedMessages)
    public receiver: User;

    @Column()
    public date: Date;
}
