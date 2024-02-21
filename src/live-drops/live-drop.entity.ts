import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import {CaseEntity} from "../cases/case.entity"
import {ItemEntity} from "../items/item.entity"
import {UserEntity} from "../users/user.entity"

@Entity('live-drops')
export class LiveDropEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column({ default: null })
    case_id: number

    @Column()
    item_id: number

    @Column('decimal', { precision: 65, scale: 2, default: 0.00 })
    price: number

    @Column({ default: 0 })
    status: number

    @Column({ default: 0 })
    invisible: number

    @Column({ default: null })
    trade_id: string

    @Column({ default: 'case' })
    type: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity

    @ManyToOne(() => ItemEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'item_id', referencedColumnName: 'id'})
    item: ItemEntity

    @ManyToOne(() => CaseEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'case_id', referencedColumnName: 'id'})
    box: CaseEntity
}
