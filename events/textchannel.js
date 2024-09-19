import { Events, PermissionsBitField, ChannelType } from 'discord.js';

export default {
	name: Events.MessageCreate, // Use the correct event name
	once: false, // Set to false since 'messageCreate' is emitted multiple times
	async execute(message) {
		// Command to create a public channel, e.g., "!createpublicchannel"
		if (message.content.startsWith('!create')) {
			const guild = message.guild;

			try {
				// Create a new public text channel
				const publicChannel = await guild.channels.create({
					name: 'public-channel', // Channel name
					type: ChannelType.GuildText, // Specify the type of channel
					permissionOverwrites: [
						{
							id: guild.roles.everyone, // @everyone role
							allow: [PermissionsBitField.Flags.ViewChannel], // Allow viewing permissions for everyone
						},
					],
				});

				// Send a confirmation message
				message.channel.send(
					`Public channel ${publicChannel.name} created and visible to everyone!`
				);
			} catch (error) {
				// console.error('Error creating channel:', error);
				console.log('Bot permissions:', guild.members.me.permissions.toArray());
				message.channel.send(
					'An error occurred while creating the public channel.'
				);
			}
		}
	},
};
