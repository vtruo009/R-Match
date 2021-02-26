import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    BaseEntity,
} from 'typeorm';
import { User } from './user';

@Entity()
export class VerificationKey extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    key: string;
}
