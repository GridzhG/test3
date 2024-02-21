import {Injectable} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {PaymentEntity} from "./payment.entity"
import {Repository} from "typeorm"
import {PromocodeService} from "../promocode/promocode.service"
import {UserEntity} from "../users/user.entity"
import crypto from 'crypto-js'
import {UsersService} from "../users/users.service"
import {ksort} from "../utils"
import datef from 'datef'
import {ConfigService} from "../config/config.service";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(PaymentEntity)
        private paymentsRepository: Repository<PaymentEntity>,
        private promocodeService: PromocodeService,
        private userService: UsersService,
        private configService: ConfigService
    ) {
    }

    async createPayment(user: UserEntity, sum: number, i: string, method: string, code: string) {
        if (sum < this.configService.config.payment.min) {
            throw `Минимальная сумма пополнения - ${this.configService.config.payment.min}Р`
        }

        if (sum > this.configService.config.payment.max) {
            throw `Максимальная сумма пополнения - ${this.configService.config.payment.max}Р`
        }

        let promocodeId

        try {
            const promocode = await this.promocodeService.checkPromocode(user, code)

            promocodeId = promocode.id
        } catch (e) {
            promocodeId = null
        }

        const payment = await this.paymentsRepository.save(
            this.paymentsRepository.create({
                sum,
                user_id: user.id,
                promo_id: promocodeId
            })
        )

        if (method === 'free-kassa') {
            const sign =
                crypto.MD5(`${this.configService.config.payment.freekassa.id}:${sum}:${this.configService.config.payment.freekassa.secret_1}:${payment.id}`)

            return {
                url: `https://www.free-kassa.ru/merchant/cash.php?m=${this.configService.config.payment.freekassa.id}&oa=${sum}&o=${payment.id}&s=${sign}&i=${i}`,
            }
        } else if (method === 'unitpay') {
            const sign =
                crypto.SHA256(`${payment.id}{up}RUB{up}Оплата{up}${sum}{up}${this.configService.config.payment.unitpay.secret_key}`)

            return {
                url: `https://unitpay.money/pay/${this.configService.config.payment.unitpay.public_key}/card?account=${payment.id}&desc=Оплата&sum=${sum}&currency=RUB&signature=${sign}&detectDevice=1&operator=${i}`,
            }

        }
    }

    async callbackUnitpayPayment(query: any) {
        if (query.method.toLowerCase() === 'check') {
            return {
                result: {
                    message: 'OK'
                }
            }
        }

        if (query.method.toLowerCase() === 'pay') {
            const payment = await this.paymentsRepository.findOne({
                where: {
                    id: query.params['account'],
                    status: 0
                }
            })

            if (!payment) {
                return {
                    error: {
                        message: 'Payment not found'
                    }
                }
            }

            const params = await ksort(query.params)

            const array = []

            for (const property in params) {
                if (property != 'signature') {
                    array.push(params[property])
                }
            }

            const sign = crypto.SHA256(`${query.method}{up}${array.join('{up}')}{up}${this.configService.config.payment.unitpay.secret_key}`).toString()

            if (sign !== query.params['signature']) {
                return {
                    error: {
                        message: 'Error sign'
                    }
                }
            }

            const user = await this.userService.findById(payment.user_id)

            if (!user) {
                return {
                    error: {
                        message: 'User not found'
                    }
                }
            }

            payment.status = 1
            await this.paymentsRepository.save(payment)

            let sum = payment.sum + await this.getBonus(user, payment)

            if (payment.promo_id !== null) {
                try {
                    const promocode = await this.promocodeService.getPromoById(payment.promo_id)

                    await this.promocodeService.checkPromocode(user, promocode.name)

                    sum += sum * (promocode.value / 100)
                    // eslint-disable-next-line no-empty
                } catch (e) {

                }
            }

            if (user.referral_use !== null) {
                const referralUser = await this.userService.getUserByReferralCode(user.referral_use)

                if (referralUser) {
                    const bonus = payment.sum * (await this.userService.getReferralPercent(user) / 100)

                    referralUser.referral_balance += bonus
                    referralUser.referral_sum += bonus
                    referralUser.referral_payment += payment.sum

                    await this.userService.update(referralUser)
                    await this.userService.updateReferralLvl(user)
                }
            }

            user.balance += sum
            await this.userService.save(user)

            return {
                result: {
                    message: 'OK'
                }
            }
        }
    }

    async callbackFreeKassaPayment(query: any) {
        const payment = await this.paymentsRepository.findOne({
            where: {
                id: query.MERCHANT_ORDER_ID,
                status: 0
            }
        })

        if (!payment) {
            return {
                error: {
                    message: 'Payment not found'
                }
            }
        }

        const sign = crypto.MD5(`${this.configService.config.payment.freekassa.id}:${payment.sum}:${this.configService.config.payment.freekassa.secret_2}:${payment.id}`).toString()

        if (sign !== query.SIGN) {
            return {
                error: {
                    message: 'Error sign'
                }
            }
        }

        const user = await this.userService.findById(payment.user_id)

        if (!user) {
            return {
                error: {
                    message: 'User not found'
                }
            }
        }

        payment.status = 1
        await this.paymentsRepository.save(payment)

        const sum = payment.sum + await this.getBonus(user, payment)

        user.balance += sum
        user.payment += sum
        await this.userService.update(user)

        return {
            result: {
                message: 'OK'
            }
        }
    }

    async getBonus(user: UserEntity, payment: PaymentEntity): Promise<any> {
        let promo_percent = 0

        if (payment.promo_id !== null) {
            try {
                const promocode = await this.promocodeService.getPromoById(payment.promo_id)
                await this.promocodeService.checkPromocode(user, promocode.name)

                if (promocode.type === 'bonus') {
                    await this.promocodeService.createUsePromocode(user.id, promocode.id)

                    promo_percent = promocode.value
                }
                // eslint-disable-next-line no-empty
            } catch (e) {

            }
        }

        const sum = payment.sum
        let bonus = 0

        if (user.referral_use !== null) {
            bonus += sum * (5 / 100)
        }

        if (promo_percent > 0) {
            bonus += sum * (promo_percent / 100)
        }

        return bonus
    }

    async getPaymentStatistic() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const d = new Date(),
            day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1),
            week = new Date(d.setDate(diff))

        week.setHours(0, 0, 0, 0)

        const date = new Date(),
            month = new Date(date.getFullYear(), date.getMonth(), 1)

        month.setHours(0, 0, 0, 0)

        return {
            daily: await this.getPaymentStatisticByDate(today),
            weekly: await this.getPaymentStatisticByDate(week),
            monthly: await this.getPaymentStatisticByDate(month),
            all: await this.getPaymentStatisticByDate(new Date(1))
        }
    }

    async getPaymentStatisticByDate(date: Date): Promise<number> {
        const sum = await this.paymentsRepository.createQueryBuilder('withdraw')
            .select('SUM(sum)', 'sum')
            .where(`status = 1 AND created_at >= :date`, {date})
            .getRawOne()

        return sum.sum === null ? 0.00 : sum.sum.toFixed(2)
    }

    async getPayments(data): Promise<PaymentEntity[]> {
        const queryBuilder = this.paymentsRepository.createQueryBuilder('payment')
        queryBuilder.leftJoinAndSelect("payment.user", "user")
        queryBuilder.leftJoinAndSelect("payment.promo", "promo")
        queryBuilder.orderBy(`payment.${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `user.username LIKE '%${data.searchValue}%' AND status = 1`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountAllPayments() {
        const sum = await this.paymentsRepository.createQueryBuilder()
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async getLastPayments(limit = 20) {
        const payments = await this.paymentsRepository.find({
            relations: ['user'],
            where: {
                status: 1
            },
            order: {
                id: 'DESC'
            },
            take: limit
        })

        return payments.map((payment) => {
            return {
                id: payment.id,
                user_id: payment.user.id,
                username: payment.user.username,
                avatar: payment.user.avatar,
                sum: payment.sum,
                created_at: datef('HH:mm dd.MM.YYYY', payment.user.created_at)
            }
        })
    }

    async getPaymentsByUserId(userId) {
        return await this.paymentsRepository.find({
            relations: ['promo'],
            where: {
                user_id: userId,
                status: 1
            }
        })
    }

    async getInfoByPromocode(promoId) {
        let sum = await this.paymentsRepository.createQueryBuilder()
            .where(`promo_id = ${promoId} AND status = 1`)
            .select('SUM(sum)', 'cnt')
            .getRawOne()

        sum = sum.cnt === null ? 0 : sum.cnt

        const count = await this.paymentsRepository.count({
            promo_id: promoId,
            status: 1
        })

        let avg = await this.paymentsRepository.createQueryBuilder()
            .where(`promo_id = ${promoId} AND status = 1`)
            .select('AVG(sum)', 'cnt')
            .getRawOne()

        avg = avg.cnt === null ? 0 : avg.cnt

        return {
            count,
            sum: sum.toFixed(2),
            avg: avg.toFixed(2)
        }
    }

    async getPaymentHour(userId: number, date) {
        const sum = await this.paymentsRepository.createQueryBuilder('withdraw')
            .select('SUM(sum)', 'sum')
            .where(`status = 1 AND user_id = :userId AND created_at >= :date`, { date, userId })
            .getRawOne()

        return sum.sum === null ? 0.00 : sum.sum.toFixed(2)
    }

}
