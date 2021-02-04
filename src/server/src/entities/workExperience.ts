import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class WorkExperience extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    startDate: string;

    @Column({ nullable: true })
    endDate?: string;

    @Column()
    employer: string;

    @Column()
    title: string;
}