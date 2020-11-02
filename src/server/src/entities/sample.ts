// import mongoose, { Schema, Document } from 'mongoose';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sample {
    constructor(id: number, message: string, num: number) {
        this.id = id;
        this.message = message;
        this.num = num;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    num: number;
}

export interface ISample {
    id: number;
    message: string;
    num: number;
}
