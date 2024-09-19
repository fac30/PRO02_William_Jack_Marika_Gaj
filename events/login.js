import { Events } from "discord.js";
import dotenv from "dotenv"; // Import dotenv using ES6 syntax
dotenv.config(); // Configure dotenv to load .env file
const discordToken = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;

export default {
  name: Events.InteractionCreate,
  once: true, // The ready event should only run once
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Fetch the channel object by ID
    const channel = client.channels.cache.get(channelId);

    // Check if the channel exists
    if (!channel) {
      console.error(`Channel with ID ${channelId} not found.`);
      return;
    }

    // Send a message to the channel
    channel.send(
      "I am alive!!! Nice to meet you, I am Verbo, your new chatbot best friend"
    );
  },
};
