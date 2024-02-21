import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common'
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {CategoriesService} from "../categories/categories.service"
import {CasesService} from "../cases/cases.service";

@Controller('admin/categories')
export class AdminCategoriesController {
    constructor(
        private categoriesService: CategoriesService,
        private casesService: CasesService
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('')
    async getCategories() {
        return await this.categoriesService.getAllCategories()
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('category/:id')
    async getCategoryById(@Param('id') id) {
        return await this.categoriesService.getCategoryById(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('category/:id/delete')
    async deleteCategoryById(@Param('id') id) {
        await this.categoriesService.deleteCategoryById(id)
        await this.casesService.updateAllCases()

        return true
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('category/:id/update')
    async updateCategoryById(@Body() body) {
        await this.categoriesService.updateCategory(body)
        await this.casesService.updateAllCases()

        return true
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('create')
    async createCategory(@Body() body) {
        await this.categoriesService.createCategory(body)
        await this.casesService.updateAllCases()

        return true
    }
}
