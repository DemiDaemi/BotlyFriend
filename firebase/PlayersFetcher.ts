import { IPlayer } from '../interfaces/IPlayer';
import { FirebaseFetcher } from './FirebaseFetcher'

export class PlayersFetcher extends FirebaseFetcher {
    constructor() {
        super()
    }

    async getAllPlayersNames(): Promise<string[]> {
        const data: any = await super.getDocument("Players", "PlayersLists");
        return (data['PlayersNames']);
    }
}
