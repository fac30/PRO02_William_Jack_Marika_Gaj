// Implement Discord’s message components like buttons and select menus using
// MessageActionRow and MessageButton or MessageSelectMenu classes from Discord.js.
// Handle interactions with client.on(Events.InteractionCreate, callback).

import {
  Client,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default {
  // Define the slash command structure
  data: new SlashCommandBuilder()
    .setName("decision") // Command name
    .setDescription("Make a decision with confirm or cancel buttons") // Command description
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The target user")
        .setRequired(true)
    ) // Add user option
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for decision")
        .setRequired(false)
    ), // Optional string option for reason

  async execute(interaction) {
    // Fetch the options provided by the user
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";


    // Create the confirm button
    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Success); // Green button for success

    // Create the cancel button
    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary); // Gray button for secondary action

    // Add buttons to an action row (container)
    const rowContainer = new ActionRowBuilder().addComponents(confirm, cancel);

    // Reply to the interaction with buttons
    await interaction.reply({
      content: `Please click confirm or cancel for the target: ${target?.username}, with reason: ${reason}`,
      components: [rowContainer],
    });
  },
};
