const { SlashCommandBuilder } = require("discord.js");
const client = require("../bot");

const initDate = new Date("2022-12-27");
const weekCount = require("../helpers/weeks");

const admin = require("../helpers/firebase");

async function listWeeks() {
  let output = "";
  const snapshot = await admin.firestore().collection("ExtraLoot").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loot")
    .setDescription("Displays who received extra loot for the past weeks"),
  async execute(interaction) {
    listWeeks();
    await interaction.reply("Coming soon! I am still working on this...");
  },
};
