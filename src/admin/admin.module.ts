import {Module} from '@nestjs/common'
import {AdminController} from './admin.controller'
import {UsersModule} from "../users/users.module"
import {PaymentModule} from "../payment/payment.module"
import {AdminCategoriesController} from "./admin-categories.controller"
import {CategoriesModule} from "../categories/categories.module"
import {AdminCaseItemsController} from "./admin-case-items.controller"
import {AdminCasesController} from "./admin-cases.controller"
import {CaseItemsModule} from "../case-items/case-items.module"
import {CasesModule} from "../cases/cases.module"
import {ItemsModule} from "../items/items.module"
import {AdminItemsController} from "./admin-items.controller"
import {AdminWithdrawsController} from "./admin-withdraws.controller"
import {LiveDropsModule} from "../live-drops/live-drops.module"
import {ScheduleModule} from "@nestjs/schedule"
import {ConfigModule} from "../config/config.module"
import {PromocodeModule} from "../promocode/promocode.module"
import {BustModule} from "../bust/bust.module"
import {UpgradeModule} from "../upgrade/upgrade.module"
import {GiveawayModule} from "../giveaway/giveaway.module"
import {AdminGiveawaysController} from "./admin-giveaways.controller"

@Module({
    imports: [UsersModule, PaymentModule, CategoriesModule, CaseItemsModule, CasesModule, ItemsModule, LiveDropsModule, ScheduleModule.forRoot(), ConfigModule, PromocodeModule, BustModule, UpgradeModule, GiveawayModule],
    controllers: [AdminController, AdminCategoriesController, AdminCaseItemsController, AdminCasesController, AdminItemsController, AdminWithdrawsController, AdminGiveawaysController]
})
export class AdminModule {
}
