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

// OpenAI Configuration
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
  });

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

// Initialise a new Collection for storing commands
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

// This line must be at the very end
// Signs the bot in with token
client.login(discordToken);





async function getOpenAIResponse(conversation) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [ // This is the missing key
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Write a haiku about recursion in programming." },
            ],
        });
        
        return completion.choices[0].message.content; // Return the generated response content
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        return "I encountered an error processing your request.";
    }
}


  client.on("messageCreate", async (message) => {
    // ignore messages from bots
    if (message.author.bot) return;
  
    // check if the message is DM or mentions the bot in a server
    if (message.channel.type === "DM" || message.mentions.has(client.user.id)) {
      let content = message.content;
  
      // if the message is in server and mentions the bot, remove the mention from the message
      if (message.channel.type !== "DM") {
        content = content
          .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
          .trim();
      }
  
      // generate and send a response using OpenAI API
      try {
        const reply = await generateOpenAIResponse(content);
        await message.channel.send(reply);
      } catch (error) {
        console.error(
          "Error in sending DM or processing OpenAI response:",
          error
        );
        // inform the user that an error occurred (optional)
        if (message.channel.type === "DM") {
          await message.author.send(
            "I encountered an error while processing your request."
          );
        }
      }
    }
});


