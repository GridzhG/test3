import {Controller, Get, HttpException, Param, Post, Query, UseGuards} from "@nestjs/common"
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {LiveDropsService} from "../live-drops/live-drops.service"
import {parseDataTableQuery} from "../utils";
import {LiveDropsResolver} from "../live-drops/live-drops.resolver";

@Controller('admin/withdraws')
export class AdminWithdrawsController {
    constructor(
        private liveDropService: LiveDropsService,
        private liveDropResolver: LiveDropsResolver
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get()
    async getWithdraws(@Query() query): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        const withdraws = await this.liveDropResolver.getWithdraws(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length
            })

        const withdrawsAll = await this.liveDropResolver.getCountWithdraws()

        return {
            draw,
            data: withdraws,
            recordsTotal: withdrawsAll,
            recordsFiltered: withdrawsAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post(':id/return')
    async returnWithdraw(@Param('id') id) {
        const withdraw = await this.liveDropResolver.getWithdrawById(id)

        if (!withdraw || withdraw.status !== 0) {
            throw new HttpException('Вывод не найден или уже отправлен', 400)
        }

        withdraw.status = 2
        withdraw.error_msg = 'Отменен администратором'
        await this.liveDropResolver.saveWithdraw(withdraw)

        withdraw.live.status = 0
        withdraw.live.trade_id = null
        await this.liveDropService.save(withdraw.live)

        await this.liveDropResolver.updateSocketStatus(withdraw.live)

        return {
            success: true
        }
    }
}