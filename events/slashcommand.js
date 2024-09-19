import { Events } from "discord.js";
import handleMessage from "../messaging/message.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    // Check if the interaction is a chat input command
    if (!interaction.isChatInputCommand()) return;

    // Get the command from the client's command collection
    const command = interaction.client.commands.get(interaction.commandName);

    // If the command doesn't exist, log an error and return
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      // Execute the command
      await command.execute(interaction);
    } catch (error) {
      // If an error occurs during execution, log it
      console.error(error);

      // Check if the interaction has already been replied to or deferred
      if (interaction.replied || interaction.deferred) {
        // If so, send a follow-up message
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        // If not, send a reply
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
