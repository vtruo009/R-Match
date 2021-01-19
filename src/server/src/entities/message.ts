import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    public date: Date;

    @Column()
    public senderId: number;

    @ManyToOne(() => User, (user) => user.sentMessages)
    public sender: User;

    @Column()
    public receiverId: number;

    @ManyToOne(() => User, (user) => user.receivedMessages)
    public receiver: User;
}