import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array")
    targetYears: string[];

    @Column()
    hoursPerWeek: number;

    @Column()
    description: string;

    @Column()
    expirationDate: Date;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column("simple-array")
    type: string[];

    @Column()
    title: string;

    @Column()
    status: 'Hiring' | 'Closed';

    @Column()
    minSalary: number;

    @Column()
    maxSalary: number;

    @Column()
    departmentId: string;
}

export interface IJob {
    id: number;
    targetYears: string[];
    hoursPerWeek: number;
    description: string;
    expirationDate?: string;
    startDate: string;
    endDate?: string;
    type: string[];
    title: string;
    status: 'Hiring' | 'Closed';
    minSalary: number;
    maxSalary?: number;
    departmentId: string;
}
