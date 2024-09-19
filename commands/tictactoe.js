import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ComponentType,
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

    let currentPlayer = "❌";

    const checkWin = () => {
      const winConditions = [
        // Horizontal wins
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        // Vertical wins
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        // Diagonal wins
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
      ];

      // Check if any of the win conditions are met
      return winConditions.some((line) =>
        line.every((cell) => cell === currentPlayer)
      );
    };

    // Function to check if the board is full (draw)
    const checkDraw = () => {
      return board.every((row) => row.every((cell) => cell !== "⬜"));
    };

    const createGrid = () => {
      const rows = [];
      for (let i = 0; i < 3; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 3; j++) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`ttt_${i}_${j}`)
              .setLabel(board[i][j])
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(board[i][j] !== "⬜") // Disable buttons that are already clicked
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

    if (!interaction.channel) {
      await interaction.followUp({
        content: "This command cannot be used in DMs or outside of a channel!",
        ephemeral: true, // Sends the message only to the user
      });
      return;
    }

    const filter = (i) => {
      return i.customId.startsWith("ttt_");
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

      await i.deferUpdate();

      // Check if the clicked button is still available
      if (board[rowIndex][colIndex] !== "⬜") {
        await i.followUp({
          content: "This square is already taken!",
          ephemeral: true,
        });
        return;
      }

      // Update the board with the current player's mark
      board[rowIndex][colIndex] = currentPlayer;

      // Check if the current player wins
      if (checkWin()) {
        // Disable all buttons and announce the winner
        await interaction.editReply({
          content: `${currentPlayer} wins! 🎉`,
          components: createGrid().map((row) => {
            row.components.forEach((button) => button.setDisabled(true));
            return row;
          }),
        });
        collector.stop(); // Stop the collector since the game has ended
        return;
      }

      // Check for a draw
      if (checkDraw()) {
        await interaction.editReply({
          content: "It's a draw! 🤝",
          components: createGrid().map((row) => {
            row.components.forEach((button) => button.setDisabled(true));
            return row;
          }),
        });
        collector.stop(); // Stop the collector since the game is a draw
        return;
      }

      // Switch to the other player after a valid move
      currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";

      // Update the message with the new board and the next player's turn
      await interaction.editReply({
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
