import dotenv from "dotenv"; // Import dotenv using ES6 syntax
dotenv.config(); // Configure dotenv to load .env file
import testing from "./testing/tests.js";
import express from "express"; // Import express
import * as Discord from "discord.js"; // Imports discord.js
import { Collection, Events } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

// Get the current module directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import getMeme from "./commands/meme.js";

// Creates new client
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});

const discordToken = process.env.DISCORD_TOKEN;

// Initialize a new Collection for storing commands
client.commands = new Collection();

async function loadCommands() {
  const foldersPath = path.join(__dirname, "commands");
  console.log("Folders Path:", foldersPath); // Ensure this path is correct

  try {
    // Read all files directly in the commands directory
    const commandFiles = await readdir(foldersPath);

    console.log("Command Files:", commandFiles); // Log the files found

    for (const file of commandFiles) {
      if (file.endsWith(".js")) {
        const filePath = path.join(foldersPath, file);
        console.log("Command file path:", filePath);

        try {
          const command = (await import(filePath)).default;

          if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
          } else {
            console.warn(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
          }
        } catch (importError) {
          console.error(`Error importing command at ${filePath}:`, importError);
        }
      }
    }
  } catch (error) {
    console.error("Error reading command files:", error);
  }
}

loadCommands();

// Initialize a collection for commands
client.commands = new Collection();

// Function to load events dynamically
async function loadEvents() {
  const eventsPath = path.join(__dirname, "events");
  console.log("Events Path:", eventsPath); // Log the path to the events folder

  try {
    // Read all the files in the 'events' folder
    const eventFiles = await readdir(eventsPath);
    console.log("Event Files:", eventFiles); // Log the event files found

    for (const file of eventFiles) {
      if (file.endsWith(".js")) {
        const filePath = path.join(eventsPath, file);
        console.log("Event file path:", filePath); // Log the path to the event file

        try {
          // Dynamically import each event file
          const event = (await import(filePath)).default;

          // Register the event with the client
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
          } else {
            client.on(event.name, (...args) => event.execute(...args));
          }
        } catch (importError) {
          console.error(`Error importing event at ${filePath}:`, importError);
        }
      }
    }
  } catch (error) {
    console.error("Error reading event files:", error); // Handle any errors in reading event files
  }
}

// Call the loadEvents function to load all event files
loadEvents();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  console.log(command);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Handle messageCreate directly in index.js
client.on(Events.MessageCreate, (message) => {
  // Ignore messages from bots to avoid an infinite loop
  if (message.author.bot) return;

  // Log received messages to the console
  console.log(`Received message: ${message.content}`);

  // Example: Respond to a specific message
  if (message.content === "!ping") {
    message.channel.send("Pong!"); // Reply with 'Pong!'
  }
});

// This line must be at the very end
// Signs the bot in with token
client.login(discordToken);
