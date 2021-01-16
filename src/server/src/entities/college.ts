import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { Department } from './department';

@Entity()
export class College extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Department, (department) => department.college, {
        onDelete: 'CASCADE',
    })
    departments: Department[];
}
