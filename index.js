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
    Discord.GatewayIntentBits.MessageContent,
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
  if (message.content === "To be or not to be") {
    message.channel.send(
      "that is the question Whether tis nobler in the mind to suffer The slings and arrows of outrageous fortune Or to take arms against a sea of troubles And by opposing end them To die To sleep No more and by a sleep to say we end The heartache and the thousand natural shocks That flesh is heir to tis a consummation Devoutly to be wished To die to sleep To sleep perchance to dream ay theres the rub For in that sleep of death what dreams may come When we have shuffled off this mortal coil Must give us pause theres the respect That makes calamity of so long life For who would bear the whips and scorns of time The oppressors wrong the proud mans contumely The pangs of despised love the laws delay The insolence of office and the spurns That patient merit of the unworthy takes When he himself might his quietus make With a bare bodkin who would fardels bear To grunt and sweat under a weary life But that the dread of something after death The undiscovered country from whose bourn No traveller returns puzzles the will And makes us rather bear those ills we have Than fly to others that we know not of Thus conscience does make cowards of us all And thus the native hue of resolution Is sicklied oer with the pale cast of thought And enterprises of great pith and moment With this regard their currents turn awry And lose the name of action Soft you now The fair Ophelia Nymph in thy orisons Be all my sins remembered"
    ); // Reply with 'Pong!'
  }
});

// This line must be at the very end
// Signs the bot in with token
client.login(discordToken);
