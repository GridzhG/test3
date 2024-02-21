import { Injectable } from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {SettingEntity} from "./setting.entity"
import {Repository} from "typeorm"

@Injectable()
export class ConfigService {
    public config: any
    public settings: any

    constructor(
        @InjectRepository(SettingEntity)
        private settingsRepository: Repository<SettingEntity>
    ) {
    }

    async onApplicationBootstrap() {
        let config = await this.settingsRepository.findOne()

        if (!config) {
            config = await this.settingsRepository.save(
                this.settingsRepository.create({
                    config: {
                        "payment": {
                            "min": 10,
                            "max": 15000,
                            "freekassa": {
                                "id": "TEST",
                                "secret_1": "TEST1",
                                "secret_2": "TEST2"
                            },
                            "unitpay": {
                                "secret_key": "TEST4",
                                "public_key": "TEST3"
                            }
                        },
                        "referral": {
                            "to_balance": 500
                        },
                        "market_csgo": {
                            "key": "GgHUm4jk90ogY5S4ucbc3zB0zlDpZJR",
                            "max_buy_percent": null
                        },
                    }
                })
            )
        }

        this.config = config.config
        this.settings = config
    }

    async update(data) {
        let config = await this.settingsRepository.findOne()

        config.config = data

        config = await this.settingsRepository.save(config)

        this.config = config.config
        this.settings = config
    }

    async updateSettings(config) {
        delete config.config
        config.bank_contracts = parseFloat(config.bank_contracts)
        config.profit_contracts = parseFloat(config.profit_contracts)
        config.percent_contracts = parseFloat(config.percent_contracts)
        config.bank_upgrades = parseFloat(config.bank_upgrades)
        config.profit_upgrades = parseFloat(config.profit_upgrades)
        config.percent_upgrades = parseFloat(config.percent_upgrades)

        config = await this.settingsRepository.save(config)

        this.settings = config
    }
}
