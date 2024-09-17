import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Start Tic Tac Toe..."),
  async execute(interaction) {
    const board = [
      ["⬜", "⬜", "⬜"],
      ["⬜", "⬜", "⬜"],
      ["⬜", "⬜", "⬜"],
    ];

    const createGrid = () => {
      const rows = [];
      for (let i = 0; i < 3; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 3; j++) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`ttt_${i}_${j}`)
              .setLabel(board[i][j] || "⬜")
              .setStyle(ButtonStyle.Secondary)
          );
        }
        rows.push(row);
      }
      return rows;
    };

    await interaction.reply({
      content: "Tic Tac Toe started! Click on a button to play!",
      components: createGrid(),
    });
  },
};
