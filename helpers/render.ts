import { IExtraLoot } from "../interfaces/IExtraLoot";
import { IExtraLootPage } from "../interfaces/IExtraLootPage";

export function renderPage(week: number, pages: IExtraLootPage[]) {
    return pages[week].loot.map((line: IExtraLoot) => {
        return `**${line.player}**: ${line.items.map((item: string, i: number) => {
            if (i < line.items.length - 1) return `${item.toString()}, `
            return `${item.toString()}`;
        }).join('')}\n`
    }).join('');
}