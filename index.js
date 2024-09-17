import dotenv from "dotenv"; // Import dotenv using ES6 syntax
dotenv.config(); // Configure dotenv to load .env file
import commands from "./commands/commands.js";
import events from "./events/events.js";
import testing from "./testing/tests.js";
import express from "express"; // Import express

import * as Discord from "discord.js"; // Imports discord.js

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
  ],
}); //creates new client

const discordToken = process.env.DISCORD_TOKEN;

const app = express(); // Initialize express

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//this line must be at the very end
client.login(discordToken); //signs the bot in with token

// Define a simple get route to display 'Hello World' on the route of the server.
// app.get("/", (req, res) => {
//     res.send("Hello, World!");

// });

// app.push("/", (req, res) => {
//   res.send("hello World");
// });

// app.delete("/");

// This is listening to port 3000 and showing in the node terminal.

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
