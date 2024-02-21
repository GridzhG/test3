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

@Entity('case_items')
export class CaseItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    case_id: number

    @Column()
    item_id: number

    @Column({ default: 1 })
    enabled: number

    @Column({ default: 1 })
    visibility: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => CaseEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'case_id', referencedColumnName: 'id'})
    box: CaseEntity

    @ManyToOne(() => ItemEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'item_id', referencedColumnName: 'id'})
    item: ItemEntity
}
