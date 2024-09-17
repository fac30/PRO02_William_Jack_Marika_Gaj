import {
  REST,
  Routes,
  Collection,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import express from "express";

// Initialize dotenv to load .env file
dotenv.config();

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the REST client
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Path to the commands directory
const commandsPath = path.join(__dirname, "commands");

// Load commands function
async function loadCommands() {
  const commands = [];

  try {
    // Read command files directly from the commands directory
    const commandFiles = await readdir(commandsPath);

    console.log("Command Files:", commandFiles); // Verify the files

    for (const file of commandFiles) {
      if (file.endsWith(".js")) {
        const filePath = path.join(commandsPath, file);
        console.log("Command file path:", filePath); // Verify the file path

        try {
          const command = (await import(filePath)).default;

          if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
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

    // Deploy commands to the server
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error("Error loading commands:", error);
  }
}

// Execute the function
await loadCommands();
