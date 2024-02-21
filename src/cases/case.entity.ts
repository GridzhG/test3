import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import {CategoryEntity} from "../categories/category.entity"

@Entity('cases')
export class CaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    category_id: number

    @Column()
    name: string

    @Column()
    image: string

    @Column()
    url: string

    @Column({ default: null })
    old_price: number

    @Column()
    price: number

    @Column({ default: 0 })
    opened: number

    @Column({ default: null })
    max_opened: number

    @Column('decimal', { precision: 65, scale: 2, default: 0.00 })
    bank: number

    @Column()
    bank_percent: number

    @Column('decimal', { precision: 65, scale: 2, default: 0.00 })
    profit: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => CategoryEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'category_id', referencedColumnName: 'id'})
    category: CategoryEntity
}
