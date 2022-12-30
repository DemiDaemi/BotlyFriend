const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("good-bot").setDescription(":)"),
  async execute(interaction) {
    await interaction.reply("Thank you! *happy beep boop noises*");
  },
};
