import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"

@Entity('promocodes')
export class PromocodeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    type: string

    @Column('double', { precision: 255, scale: 2, default: 0.00 })
    value: number

    @Column({ default: null })
    limited: number

    @Column({ default: null })
    end_time: Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}