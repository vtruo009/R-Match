// import mongoose, { Schema, Document } from 'mongoose';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
    constructor(id: number, targetYears: string, hoursPerWeek: number, description: string,
        startDate: Date, endDate: Date, type: string, title: string, status: string,
        minSalary: number, maxSalary: number) {
        this.id = id;
        this.targetYears = targetYears;
        this.hoursPerWeek = hoursPerWeek;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
        this.title = title;
        this.status = status;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    targetYears: string;

    @Column()
    hoursPerWeek: number;

    @Column()
    description: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    status: string;

    @Column()
    minSalary: number;

    @Column()
    maxSalary: number;
}

export interface IJob {
    id: number;
    targetYears: string;
    hoursPerWeek: number;
    description: string;
    startDate: Date;
    endDate: Date;
    type: string;
    title: string;
    status: string;
    minSalary: number;
    maxSalary: number;
}
