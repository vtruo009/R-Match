// import mongoose, { Schema, Document } from 'mongoose';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
    constructor(id: number, targetYears: string[], hoursPerWeek: number, description: string,
        expirationDate: Date, startDate: Date, endDate: Date, type: string[], title: string, status: string,
        minSalary: number, maxSalary: number, departmentId: string) {
        this.id = id;
        this.targetYears = targetYears;
        this.hoursPerWeek = hoursPerWeek;
        this.description = description;
        this.expirationDate = expirationDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
        this.title = title;
        this.status = status;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.departmentId = departmentId;
    }

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

    @Column()
    endDate: Date;

    @Column("simple-array")
    type: string[];

    @Column()
    title: string;

    @Column()
    status: string;

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
    expirationDate: Date;
    startDate: Date;
    endDate: Date;
    type: string[];
    title: string;
    status: string;
    minSalary: number;
    maxSalary: number;
    departmentId: string;
}
