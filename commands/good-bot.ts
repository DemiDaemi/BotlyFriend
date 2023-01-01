import { SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("good-bot").setDescription(":)"),
  async execute(interaction: any) {
    await interaction.reply("Thank you! *happy beep boop noises*");
  },
};
