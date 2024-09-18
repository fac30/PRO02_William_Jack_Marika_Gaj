import dotenv from "dotenv"; // Import dotenv using ES6 syntax
dotenv.config(); // Configure dotenv to load .env file
import testing from "./testing/tests.js";
import express from "express"; // Import express
import * as Discord from "discord.js"; // Imports discord.js
import { Collection, Events } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";

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
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});

const discordToken = process.env.DISCORD_TOKEN;

// Initialise a new Collection for storing commands
client.commands = new Collection();

async function loadCommands() {
  // Define the path to the 'commands' directory using path.join to handle cross-platform path issues.
  const foldersPath = path.join(__dirname, "commands");

  // Log the path to ensure it's correct and the directory exists.
  console.log("Folders Path:", foldersPath); // Ensure this path is correct

  try {
    // Read all files in the 'commands' directory asynchronously using readdir.
    // readdir returns an array of file names in the directory.
    const commandFiles = await readdir(foldersPath);

    // Log the names of all command files found in the directory.
    console.log("Command Files:", commandFiles); // Log the files found

    // Iterate over each file name in the 'commandFiles' array.
    for (const file of commandFiles) {
      // Check if the file has a .js extension to ensure it's a JavaScript file.
      if (file.endsWith(".js")) {
        // Construct the full path to the command file.
        const filePath = path.join(foldersPath, file);

        try {
          // Dynamically import the command module from the file path.
          // `import(filePath)` is used to import ES modules dynamically.
          // Access the default export of the module using `.default`.
          const command = (await import(filePath)).default;

          // Check if the imported command has the required properties: 'data' and 'execute'.
          if ("data" in command && "execute" in command) {
            // Add the command to the `client.commands` collection using the command's name as the key.
            client.commands.set(command.data.name, command);
          } else {
            // Log a warning if the command is missing the required properties.
            console.warn(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
          }
        } catch (importError) {
          // Log an error if there is an issue importing the command file.
          console.error(`Error importing command at ${filePath}:`, importError);
        }
      }
    }
  } catch (error) {
    // Log an error if there is an issue reading the command files from the directory.
    console.error("Error reading command files:", error);
  }
}

// Call the loadCommands function to load all commands into the client.

loadCommands();

/**
 * Asynchronously loads all event files from the 'events' directory.
 * Reads the files, dynamically imports them, and registers them with the client.
 */
async function loadEvents() {
  // Define the path to the 'events' directory using path.join to handle cross-platform path issues.
  const eventsPath = path.join(__dirname, "events");
  // Log the path to ensure it's correct and the directory exists.
  console.log("Events Path:", eventsPath); // Log the path to the events folder

  try {
    // Read all files in the 'events' directory asynchronously using readdir.
    // readdir returns an array of file names in the directory.
    const eventFiles = await readdir(eventsPath);

    // Log the names of all event files found in the directory.
    console.log("Event Files:", eventFiles);

    // Iterate over each file name in the 'eventFiles' array.
    for (const file of eventFiles) {
      // Check if the file has a .js extension to ensure it's a JavaScript file.
      if (file.endsWith(".js")) {
        // Construct the full path to the event file.
        const filePath = path.join(eventsPath, file);
        // Log the full path of the event file being processed.
        console.log("Event file path:", filePath); // Log the path to the event file

        try {
          // Dynamically import the event module from the file path.
          // `import(filePath)` is used to import ES modules dynamically.
          // Access the default export of the module using `.default`.
          const event = (await import(filePath)).default;

          // Register the event with the client.
          // Check if the event should be handled once (single occurrence) or multiple times.
          if (event.once) {
            // Register an event listener that only triggers once using `client.once`.
            client.once(event.name, (...args) => event.execute(...args));
            // Register an event listener that can trigger multiple times using `client.on`.
          } else {
            client.on(event.name, (...args) => event.execute(...args));
          }
          // Log an error if there is an issue importing the event file.
        } catch (importError) {
          console.error(`Error importing event at ${filePath}:`, importError);
        }
      }
    }
  } catch (error) {
    // Log an error if there is an issue reading the event files from the directory.
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

// Handle messageCreate event
client.on(Events.MessageCreate, handleMessage);

// Function to handle messages
async function handleMessage(message) {
  if (message.author.bot) return;

  const prefix = "!";
  const content = message.content.trim();
  console.log(`Received message: ${content}`);
  

  if (message.content.startsWith(prefix)) {
    await handleOpenAIResponse(message);
  }
}


// Function to determine if a message should be processed
function shouldProcessMessage(message) {
  console.log("checking message processing")
  return message.channel.type === ChannelType.DM || message.mentions.has(client.user.id);
}

// Function to handle OpenAI response
async function handleOpenAIResponse(message) {
  let cleanContent = message.content;

  console.log("I am calloing handleopenairesponse")

  if (message.channel.type !== ChannelType.DM) {
    cleanContent = cleanContent.replace(new RegExp(`<@!?${client.user.id}>`, "g"), "").trim();
  }

  try {
    console.log("Sending to OpenAI:", cleanContent);
    const reply = await getOpenAIResponse(cleanContent);
    console.log("OpenAI Response to send:", reply);
    await message.channel.send(reply);
  } catch (error) {
    console.error("Error processing OpenAI response:", error);
    await handleOpenAIError(message);
  }
}

// Function to get OpenAI response
async function getOpenAIResponse(conversation) {
  try {
    console.log("Sending to OpenAI:", conversation);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: conversation },
      ],
      max_tokens: 150,
    });

    console.log("OpenAI Response:", completion.choices[0].message.content);
    return completion.choices[0].message.content;
    // throw new Error();
  } catch (error) {
    console.error("Error with OpenAI API:", error.response ? error.response.data : error.message || error);
    // "I encountered an error processing your request.";
  }
}

// This line must be at the very end
// Signs the bot in with token
client.login(discordToken);
