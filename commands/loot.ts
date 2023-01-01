import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

import { ExtraLootFetcher } from "../firebase/ExtraLootFetcher";
import { IExtraLoot } from "../interfaces/IExtraLoot";
import { IExtraLootPage } from "../interfaces/IExtraLootPage";

import { currentWeek } from "../helpers/weeks";
import { renderPage } from "../helpers/render";

let pages: IExtraLootPage[];


async function listWeeks() {
  const extraLootFetcher = new ExtraLootFetcher();
  pages = await extraLootFetcher.getAllExtraLoot();
}

function lootDisplayWeek(week: any) {
  let title = `\n***${pages[week].weekNumber}***\n`;
  let items: string;

  items = renderPage(week, pages)

  return title + items;


}

function getButtons(weekIndex: number) {
  let row = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setDisabled(weekIndex < 1)
      .setCustomId("previousWeek")
      .setLabel("⬅️")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setDisabled(weekIndex == currentWeek)
      .setCustomId("nextWeek")
      .setLabel("➡️")
      .setStyle(ButtonStyle.Primary),
  ]);
  return row;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loot")
    .setDescription("Displays who received extra loot for the past weeks"),
  async execute(interaction: any) {
    let weekIndex = currentWeek;
    await listWeeks();

    await interaction.reply({
      content: lootDisplayWeek(currentWeek),
      components: [getButtons(weekIndex)],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 180000,
    });

    collector.on("collect", async (i: any) => {
      if (i.customId === "previousWeek" && weekIndex > 0) {
        weekIndex--;
      }

      if (i.customId === "nextWeek" && weekIndex < currentWeek) {
        weekIndex++;
      }
      await i.update({
        content: lootDisplayWeek(weekIndex),
        components: [getButtons(weekIndex)],
      });
    });
  },
};
