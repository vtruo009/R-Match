import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { User } from './user';
import { Department } from './department';
import { Job } from './job';

@Entity()
export class FacultyMember extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    departmentId?: number;

    @ManyToOne(() => Department, { nullable: true })
    department?: Department;

    @Column({ nullable: true })
    websiteLink?: string;

    @Column({ nullable: true })
    office?: string;

    @Column({ nullable: true })
    title?: string;

    @Column()
    userId: number;

    @OneToOne(() => User, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @OneToMany(() => Job, (job) => job.facultyMember)
    jobs: Job[];
}
