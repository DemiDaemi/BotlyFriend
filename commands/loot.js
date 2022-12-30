const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  MessageComponentInteraction,
  Message,
} = require("discord.js");
const admin = require("../helpers/firebase");

const initDate = new Date("2022-12-27");
const weekCount = require("../helpers/weeks");
const currentWeek = weekCount(initDate);

let pages = [currentWeek];

async function listWeeks() {
  const snapshot = await admin.firestore().collection("ExtraLoot").get();
  snapshot.forEach((doc, index) => {
    players = doc.data();

    const loot = [];

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

  console.log(pages);
}

function lootDisplayWeek(week) {
  let title = `***${pages[week].weekNumber}***\n\n`;

  let items = "";
  pages[week].loot.forEach((loot) => {
    let sb = `**${loot.player}: **`;
    loot.items.forEach((item, i) => {
      sb += `${item}`;
      if (i < loot.items.length - 1) sb += ", ";
    });

    items += `${sb} \n`;
  });

  return title + items;
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
  async execute(interaction) {
    await listWeeks();

    await interaction.reply({
      content: lootDisplayWeek(weekIndex),
      components: [getButtons()],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 180000,
    });

    collector.on("collect", async (i) => {
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
