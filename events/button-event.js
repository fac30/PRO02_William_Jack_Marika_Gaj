import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    // Check if the interaction is a button click
    if (interaction.isButton()) {
      console.log(`Button clicked with customId: ${interaction.customId}`);

      try {
        // Handle Confirm button
        if (interaction.customId === "confirm") {
          await interaction.update({
            content: "You have confirmed the action!",
            components: [],
          });
        }

        // Handle Cancel button
        else if (interaction.customId === "cancel") {
          await interaction.update({
            content: "You have cancelled the action.",
            components: [],
          });
        }
      } catch (error) {
        console.error("Failed to update interaction:", error);
      }
    }
  },
};
