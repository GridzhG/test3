import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('settings')
export class SettingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('json')
    config: any

    @Column('decimal', { precision: 65, scale: 2, default: 0 })
    bank_upgrades: number

    @Column('decimal', { precision: 65, scale: 2, default: 0 })
    profit_upgrades: number

    @Column('decimal', { precision: 65, scale: 2, default: 25 })
    percent_upgrades: number

    @Column('decimal', { precision: 65, scale: 2, default: 0 })
    bank_contracts: number

    @Column('decimal', { precision: 65, scale: 2, default: 0 })
    profit_contracts: number

    @Column('decimal', { precision: 65, scale: 2, default: 25 })
    percent_contracts: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}