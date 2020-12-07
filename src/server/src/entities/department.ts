import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import { College } from './college';

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => College, college => college.departments)
    college: College;
}

export interface IDepartment {
    id: number;
    name: string;
    college: College;
}
