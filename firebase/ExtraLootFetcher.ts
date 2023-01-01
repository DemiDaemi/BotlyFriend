import { IExtraLoot } from '../interfaces/IExtraLoot'
import { IExtraLootPage } from '../interfaces/IExtraLootPage';
import { FirebaseFetcher } from './FirebaseFetcher'

export class ExtraLootFetcher extends FirebaseFetcher {
    constructor() {
        super()
    }

    async getAllExtraLoot(): Promise<IExtraLootPage[]> {
        const data = await super.getCollection("ExtraLoot");
        const pages = data.map((doc: any) => ({ id: doc.id, data: doc.data }));


        return pages.map((page: any) => {
            const loot: IExtraLoot[] = [];

            Object.entries(page.data).forEach(([player, items]: any) => {
                loot.push({ player: player, items })
            })

            return { weekNumber: page.id, loot }
        })
    }

    async getExtraLootByWeek(week: number): Promise<IExtraLootPage> {
        const allLoot = await this.getAllExtraLoot();

        return allLoot[week]
    }
}
