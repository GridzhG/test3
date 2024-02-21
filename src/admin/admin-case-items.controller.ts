import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common"
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {CaseItemsService} from "../case-items/case-items.service"

@Controller('admin/case_items')
export class AdminCaseItemsController {
    constructor(
        private caseItemsService: CaseItemsService
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('case/:id')
    async getItemsInCases(@Param('id') id) {
        return await this.caseItemsService.getAdminItemsByCaseId(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('case/:id/:case_id/delete')
    async deleteItemInCases(@Param('id') id, @Param('case_id') caseId) {
        return await this.caseItemsService.deleteItem(id, caseId)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('item/:id')
    async getItemById(@Param('id') id) {
        return await this.caseItemsService.getItemById(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('item/:id/:case_id/update')
    async updateItemById(@Body() body, @Param('case_id') caseId) {
        return await this.caseItemsService.updateItemById(body, caseId)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('create')
    async createItemInCase(@Body() body) {
        return await this.caseItemsService.createItem(body)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('transfer')
    async transferItems(@Body() body) {
        return await this.caseItemsService.transferItems(body)
    }
}