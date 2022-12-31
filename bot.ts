const fs = require("node:fs");
const path = require("node:path");

const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const botClient: any = new Client({ intents: [GatewayIntentBits.Guilds] });

const { token } = require("./config.json");

// Create a Collection of commands based on the files created in the ./commands/ directory
botClient.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: string) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    botClient.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Create an Interaction based on the invoked command from a chat input
botClient.on(Events.InteractionCreate, async (interaction: { isChatInputCommand: () => any; client: { commands: { get: (arg0: any) => any; }; }; commandName: any; reply: (arg0: { content: string; ephemeral: boolean; }) => any; }) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

botClient.login(token);


export const client = botClient;
