require("dotenv").config();
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
console.log("API Key:", apiKey);
console.log("API Secret:", apiSecret);


// Loading command files
// const fs = require('node:fs');
// const path = require('node:path');
// const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client.commands = new Collection();


// command handler
// client.commands = new Collection();

// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file) => file.endsWith(".js"));

// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   client.commands.set(command.data.name, command);
//   commands.push(command.data.toJSON());
// }