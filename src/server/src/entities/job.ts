// import mongoose, { Schema, Document } from 'mongoose';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
    constructor(id: number, hoursPerWeek: number) {
        this.id = id;
        this.hoursPerWeek = hoursPerWeek;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hoursPerWeek: number;
}

export interface IJob {
    id: number;
    hoursPerWeek: number;
}
