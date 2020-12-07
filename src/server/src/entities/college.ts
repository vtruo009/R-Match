import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Department } from './department';

@Entity()
export class College {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Department, department => department.college)
    departments: Department[];
}

export interface ICollege {
    id: number;
    name: string;
    departments?: Department[];
}
