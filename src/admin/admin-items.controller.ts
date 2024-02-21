import {Body, Controller, Get, HttpException, Param, Post, Query, UseGuards} from "@nestjs/common"
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {ItemsService} from "../items/items.service"
import {parseDataTableQuery} from "../utils";

@Controller('admin/items')
export class AdminItemsController {
    constructor(
        private itemService: ItemsService
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get()
    async getItems(@Query() query): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        const items = await this.itemService.getAllItems(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length
            })

        const itemsAll = await this.itemService.getCountItems()

        return {
            draw,
            data: items,
            recordsTotal: itemsAll,
            recordsFiltered: itemsAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get(':id')
    async getItem(@Param('id') id): Promise<any> {
        return await this.itemService.findById(id)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post(':id/save')
    async saveItem(@Param('id') id, @Body() body): Promise<any> {
        const item = await this.itemService.findById(id)
        item.price = body.price

        return await this.itemService.saveItem(item)
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('create')
    async createItem(@Body() body): Promise<any> {
        try {
            const {url} = body
            const name = url.split('/')[6]

            await this.itemService.createItem(name)

            return true
        } catch (e) {
            throw new HttpException('Не смог найти предмет', 400)
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('prices/refresh')
    async refreshPrices(): Promise<any> {
        this.itemService.plannedUpdatePrices = true

        return {
            success: true
        }
    }
}