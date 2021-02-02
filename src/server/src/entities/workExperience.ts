import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
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