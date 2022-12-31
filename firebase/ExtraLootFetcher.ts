import { IExtraLoot } from '../interfaces/IExtraLoot'
import { FirebaseFetcher } from './FirebaseFetcher'

export class ExtraLootFetcher extends FirebaseFetcher {
    constructor() {
        super()
    }

    async getAllExtraLoot(): Promise<IExtraLoot | null> {
        return await super.getCollection("ExtraLoot") as any;
    }
}