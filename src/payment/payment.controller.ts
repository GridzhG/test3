import {Controller, Get, HttpException, Query} from '@nestjs/common'
import {PaymentService} from "./payment.service"

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) {
    }

    @Get('callback/freekassa')
    async callback(@Query() query) {
        try {
            return await this.paymentService.callbackFreeKassaPayment(query)
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }

    @Get('callback/unitpay')
    async callbackUnitpay(@Query() query) {
        try {
            return await this.paymentService.callbackUnitpayPayment(query)
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
