import dotenv from "dotenv"; // Import dotenv using ES6 syntax
dotenv.config(); // Configure dotenv to load .env file
import Events from "./events/events.js";
import testing from "./testing/tests.js";
import express from "express"; // Import express
import * as Discord from "discord.js"; // Imports discord.js
import { Collection } from "discord.js";
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

// Function to load commands
async function loadCommands() {
  const foldersPath = path.join(__dirname, "commands");
  console.log(foldersPath);
  try {
    const commandFolders = await readdir(foldersPath, { withFileTypes: true });
    // console.log(commandFolders);

    for (const folder of commandFolders) {
      if (folder.isDirectory()) {
        const commandsPath = path.join(foldersPath, folder.name);
        const commandFiles = await readdir(commandsPath);

        for (const file of commandFiles) {
          if (file.endsWith(".js")) {
            const filePath = path.join(commandsPath, file);
            console.log(filePath);
            const command = (await import(filePath)).default;
            console.log(command);

            if ("data" in command && "execute" in command) {
              client.commands.set(command.data.name, command);
            } else {
              console.warn(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error loading commands:", error);
  }
}

loadCommands();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
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

// This line must be at the very end
// Signs the bot in with token
client.login(discordToken);

// const app = express(); // Initialize express
// Define a simple get route to display 'Hello World' on the route of the server.
// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });

// app.push("/", (req, res) => {
//   res.send("hello World");
// });

// app.delete("/");

// This is listening to port 3000 and showing in the node terminal.

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Listening on http://localhost:${PORT}`);
// });
