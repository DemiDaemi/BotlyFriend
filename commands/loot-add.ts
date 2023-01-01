import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";
import { client } from "../bot";
import { ExtraLootFetcher } from "../firebase/ExtraLootFetcher";
import { FirebaseInsert } from "../firebase/FirebaseInsert";
import { PlayersFetcher } from "../firebase/PlayersFetcher";
import { renderPage } from "../helpers/render";
import { currentWeek } from "../helpers/weeks";
import { IExtraLootPage } from "../interfaces/IExtraLootPage";

const playerNames = [] as any;
const itemTypes = [
  "Weapon",
  "Head",
  "Chest",
  "Hands",
  "Legs",
  "Feet",
  "Ears",
  "Neck",
  "Wrists",
  "Ring",
];
const pages: IExtraLootPage[] = [];
const firebaseInsert = new FirebaseInsert();

async function getLoot() {
  pages.length = 0;
  const extraLootFetcher = new ExtraLootFetcher();
  pages.push(await extraLootFetcher.getExtraLootByWeek(currentWeek));
}

async function getPlayers() {
  playerNames.length = 0;
  const playersFetcher = new PlayersFetcher();
  playerNames.push(... await playersFetcher.getAllPlayersNames());
}

function getSelectPlayer() {
  let playerOptions = [] as any;
  playerNames.forEach((playerName: any) => {
    playerOptions.push({
      label: playerName,
      value: playerName,
    });
  });

  const selectPlayer = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("player-select")
      .setPlaceholder("Player name")
      .addOptions(playerOptions),
  );

  return selectPlayer;
}

function getSelectItem() {
  let itemsOptions = [] as any;
  itemTypes.forEach((itemType) => {
    itemsOptions.push({
      label: itemType,
      value: itemType,
    });
  });

  const selectItem = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("item-select")
      .setPlaceholder("Item type")
      .addOptions(itemsOptions)
  )

  return selectItem;
}

function getButtons() {
  let row = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setCustomId("add-more")
      .setLabel("Add another item ➕")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("done")
      .setLabel("Done!")
      .setStyle(ButtonStyle.Danger),
  ]);
  return row;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loot-add")
    .setDescription("Let's you pick which items were looted for this week."),
  async execute(interaction: any) {
    await getPlayers();
    await getLoot();

    let items = renderPage(currentWeek, pages)
    if (items === "") {
      items = "No items so far this week.";
    }

    let currentLoot = `Current loot so far:\n\n${items}\n\n`
    let content = `Adding extra loot for Week ${currentWeek + 1}.\n\n${currentLoot}`

    await interaction.reply({
      content: `${content} Who will the next piece go to?`,
      components: [getSelectPlayer()],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 300000,
    });

    let selectedPlayer = "";

    collector.on("collect", async (i: any) => {
      if (i.customId === "player-select") {
        selectedPlayer = i.values[0];
        await i.update({
          content: `${content}Which item should go to ${selectedPlayer} ?`,
          components: [getSelectItem()],
        });
      }

      if (i.customId === "item-select") {
        await firebaseInsert.insertExtraLoot(`Week ${currentWeek + 1}`, selectedPlayer, i.values[0])
        await getLoot();
        let items = renderPage(currentWeek, pages)
        if (items === "") {
          items = "No items so far this week.";
        }
        currentLoot = `Current loot so far:\n\n${items}\n\n`
        await i.update({
          content: `Item ${i.values[0]} given to ${selectedPlayer}. Congrats!\n\n${currentLoot} `,
          components: [getButtons()],
        });
      }

      if (i.customId === "done") {
        await i.update({
          content: currentLoot,
          components: [],
        })
        return;
      }

      if (i.customId === "add-more") {
        let items = renderPage(currentWeek, pages)
        if (items === "") {
          items = "No items so far this week.";
        }

        let currentLoot = `Current loot so far: \n\n${items} \n\n`
        let content = `Adding extra loot for Week ${currentWeek + 1}.\n\n${currentLoot}Who will the next piece go to ? `

        await i.update({
          content: `${content} Who will the next piece go to?`,
          components: [getSelectPlayer()]
        })
      }
    });
  },
};
