import { Injectable } from '@nestjs/common'
import {Repository} from "typeorm"
import {CategoryEntity} from "./category.entity"
import {InjectRepository} from "@nestjs/typeorm"

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository: Repository<CategoryEntity>
    ) {
    }

    async getAllCategories(): Promise<CategoryEntity[]> {
        return await this.categoryRepository.find({
            order: {
                sorting: 'ASC'
            }
        })
    }

    async getCategoryById(id: number): Promise<CategoryEntity> {
        return await this.categoryRepository.findOne(id)
    }

    async deleteCategoryById(id: number) {
        return await this.categoryRepository.delete(id)
    }

    async updateCategory(data: any): Promise<any> {
        return await this.categoryRepository.update(data.id, data)
    }

    async createCategory(body: any): Promise<CategoryEntity[]> {
        return await this.categoryRepository.save(
            this.categoryRepository.create(body)
        )
    }
}
