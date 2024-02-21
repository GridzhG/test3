import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common"
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {GiveawayService} from "../giveaway/giveaway.service"

@Controller('admin/giveaways')
export class AdminGiveawaysController {
    constructor(
        private giveawayService: GiveawayService
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('')
    async getGiveaways() {
        return await this.giveawayService.getAllGiveaways()
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('get_users/:id')
    async getUsers(@Param('id') id) {
        return await this.giveawayService.getUsersByGiveawayId(id)
    }


    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('delete/:id')
    async deleteGiveaway(@Param('id') id) {
        return await this.giveawayService.deleteGiveaway(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('create')
    async createGiveaway(@Body() body) {
        return await this.giveawayService.createGiveaway(body.giveaway)
    }
}