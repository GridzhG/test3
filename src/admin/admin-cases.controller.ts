import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common"
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {CasesService} from "../cases/cases.service"

@Controller('admin/cases')
export class AdminCasesController {
    constructor(
        private casesService: CasesService
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('')
    async getCases() {
        return await this.casesService.getAllCases()
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('case/:id')
    async getCasesById(@Param('id') id) {
        return await this.casesService.findById(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('case/:id/delete')
    async deleteCasesById(@Param('id') id) {
        return await this.casesService.deleteCasesById(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('case/:id/update')
    async updateCasesById(@Body() body) {
        return await this.casesService.updateCases(body)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('create')
    async createCases(@Body() body) {
        return await this.casesService.createCases(body)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('fakeOpens')
    async fakeOpens(@Body() body) {
        return await this.casesService.fakeOpen(body.case_id, 1000)
    }
}