import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {CategoryEntity} from "./category.entity"

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  exports: [TypeOrmModule, CategoriesService],
  providers: [CategoriesService]
})
export class CategoriesModule {}
