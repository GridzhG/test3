import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import {UserEntity} from "../users/user.entity"
import {GiveawayEntity} from "./giveaway.entity"

@Entity('giveaway_users')
export class GiveawayUsersEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: null })
    user_id: number

    @Column({ default: null })
    giveaway_id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity

    @ManyToOne(() => GiveawayEntity, { cascade: true, onDelete: "CASCADE", primary: true})
    @JoinColumn({name: 'giveaway_id', referencedColumnName: 'id'})
    giveaway: GiveawayEntity
}
