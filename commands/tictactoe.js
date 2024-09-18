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

    const filter = (i) => {
      i.customId.startsWith("ttt_") && i.user.id === interaction.user.id;
    };
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
      time: 60000, // 1 minute timeout
    });

    collector.on("collect", async (i) => {
      const [_, row, col] = i.customId.split("_");
      const rowIndex = parseInt(row);
      const colIndex = parseInt(col);

      // Update the board
      if (board[rowIndex][colIndex] === "⬜") {
        board[rowIndex][colIndex] = currentPlayer;
        currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";
      }

      // Check for win condition or draw (this can be added later)

      await i.update({
        content: `Tic Tac Toe ongoing! ${currentPlayer}'s turn`,
        components: createGrid(),
      });
    });

    collector.on("end", async () => {
      await interaction.editReply({
        content: "Tic Tac Toe game ended.",
        components: [],
      });
    });
  },
};
