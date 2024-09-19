// You need to import SlashCommandBuilder from discord.js to create a slash command.
// Import PermissionFlagsBits to set permission requirements for the command.
// Import ChannelType to define what kind of channel will be created.
// Define the Command:
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('createnewchannel') // Defines the name of the command
		.setDescription('This command creates a text channel called "new"') // Adds a description
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Sets permission required to use the command
  
	async execute(interaction) {
		// Reply to the interaction
		await interaction.reply({
			content: "Fetched all input and working on your request!",
		});
	}
};

