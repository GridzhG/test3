import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
    username: string

    @Column()
    steamId: string

    @Column()
    avatar: string

    @Column({ default: null })
    trade_url: string

    @Column('decimal', { precision: 65, scale: 2, default: 0 })
    balance: number

    @Column('double', { precision: 255, scale: 2, default: 0.00 })
    referral_balance: number

    @Column('decimal', { precision: 65, scale: 2, default: 0 })
    profit: number

    @Column({  default: 0 })
    opened: number

    @Column({  default: 0 })
    contracts: number

    @Column({  default: 0 })
    upgrades: number

    @Column({ default: 'user' })
    role: string

    @Column({ default: 0 })
    is_ban_chat: number

    @Column()
    referral_code: string

    @Column({ default: 0 })
    referral_invited: number

    @Column({ default: 1 })
    referral_lvl: number

    @Column({ default: null })
    referral_use: string

    @Column('double', { precision: 255, scale: 2, default: 0.00 })
    referral_sum: number

    @Column('double', { precision: 255, scale: 2, default: 0.00 })
    referral_payment: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}