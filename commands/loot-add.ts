import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";
const admin = require("../firebase/Firebase");

const initDate = new Date("2022-12-27");
const weekCount = require("../helpers/weeks");
const currentWeek = weekCount(initDate);

const currentWeekLoot = require("./loot");

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

async function listPlayers() {
  const snapshot = await admin.firestore().collection("Players").get();

  snapshot.forEach((doc: any) => {
    Object.entries(doc.data()).forEach(([key, value]: any) => {
      if (key === "PlayersNames") {
        value.forEach((player: any) => {
          playerNames.push(player);
        });
      }
    });
  });

  //console.log(snapshot);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loot-add")
    .setDescription("Let's you pick which items were looted for this week."),
  async execute(interaction: any) {
    await listPlayers();

    let playerOptions = [] as any;
    playerNames.forEach((playerName: any) => {
      playerOptions.push({
        label: playerName,
        value: playerName,
      });
    });

    const playerRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("player-select")
        .setPlaceholder("Player name")
        .addOptions(playerOptions)
    );

    let itemsOptions = [] as any;
    itemTypes.forEach((itemType) => {
      itemsOptions.push({
        label: itemType,
        value: itemType,
      });
    });

    const itemRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("item-select")
        .setPlaceholder("Item type")
        .addOptions(itemsOptions)
    );

    let items = await currentWeekLoot();
    if (items === "") {
      items = "No items so far this week.";
    }

    await interaction.reply({
      content: `Adding extra loot for Week ${currentWeek}. \n\nCurrent loot so far:\n\n${items}\n\n`,
      components: [playerRow, itemRow],
    });
  },
};
