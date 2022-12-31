import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
const admin = require("../firebase/Firebase");

const initDate = new Date("2022-12-27");
const weekCount = require("../helpers/weeks");
const currentWeek = weekCount(initDate);

let pages = [currentWeek];

async function listWeeks() {
  const snapshot = await admin.firestore().collection("ExtraLoot").get();
  snapshot.forEach((doc: any, index: any) => {
    let players = doc.data();

    const loot = [] as any;

    index = 0;
    Object.entries(players).forEach(([player, items]) => {
      loot.push({
        player: player,
        items: items,
      });
      index++;
    });

    pages.push({
      weekNumber: doc.id,
      loot: loot,
    });
  });
}

function lootDisplayWeek(week: any) {
  let title = `***${pages[week].weekNumber}***\n\n`;

  let items = "";
  pages[week].loot.forEach((loot: any) => {
    let sb = `**${loot.player}: **`;
    loot.items.forEach((item: any, i: any) => {
      sb += `${item}`;
      if (i < loot.items.length - 1) sb += ", ";
    });

    items += `${sb} \n`;
  });

  return title + items;
}

async function currentWeekLoot() {
  await listWeeks();

  let items = "";
  let loot = pages[currentWeek].loot;

  loot.forEach((loot: any) => {
    let sb = `**${loot.player}: **`;
    loot.items.forEach((item: any, i: any) => {
      sb += `${item}`;
      if (i < loot.items.length - 1) sb += ", ";
    });

    items += `${sb} \n`;
  });

  return items;
}

let weekIndex = currentWeek;

function getButtons() {
  let row = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setDisabled(weekIndex < 2)
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
    await listWeeks();

    await interaction.reply({
      content: lootDisplayWeek(weekIndex),
      components: [getButtons()],
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
        components: [getButtons()],
      });
    });
  },
};
// currentWeekLoot;
