import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import {UserEntity} from "../users/user.entity";
import {PromocodeEntity} from "../promocode/promocode.entity";

@Entity('payments')
export class PaymentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column({ default: null })
    promo_id: number

    @Column('double', { default: null })
    sum: number

    @Column({ default: 0 })
    status: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity

    @ManyToOne(() => PromocodeEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'promo_id', referencedColumnName: 'id'})
    promo: PromocodeEntity
}