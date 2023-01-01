const { Events } = require("discord.js");
import { client } from './bot'


client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setActivity(`Beep boop boop`);
});

client.on("guildCreate", (guild: { channels: { cache: any[]; }; }) => {
  guild.channels.cache
    .find((channel) => channel.name === "general-chat")
    .send(
      `Hello, my name is BotlyFriend! I'm still learning, but in the future I'll be able to help with things like keeping track of loot and more. I hope everybody has fun tonight!`
    );
});
