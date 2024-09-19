import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ComponentType,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tictactoe") // Define the slash command name as 'tictactoe'
    .setDescription("Start Tic Tac Toe..."), // Description of the command

  async execute(interaction) {
    // Initialize a 3x3 board for the Tic Tac Toe game, represented by emojis.
    const board = [
      ["⬜", "⬜", "⬜"],
      ["⬜", "⬜", "⬜"],
      ["⬜", "⬜", "⬜"],
    ];

    // The first player to play will always be "❌ "
    let currentPlayer = "❌";

    // Function to check if the current player has won
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

    // Function to check if the game ends in a draw (i.e., no more moves available)
    const checkDraw = () => {
      return board.every((row) => row.every((cell) => cell !== "⬜"));
    };

    // Function to create the button grid representing the Tic Tac Toe board
    const createGrid = () => {
      const rows = [];
      for (let i = 0; i < 3; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 3; j++) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`ttt_${i}_${j}`) // Custom ID to identify which button was clicked
              .setLabel(board[i][j]) // Label with the current symbol on the board
              .setStyle(ButtonStyle.Secondary) // Button style (gray for neutral buttons)
              .setDisabled(board[i][j] !== "⬜") // Disable buttons that are already clicked
          );
        }
        rows.push(row); // Add the row to the grid
      }
      return rows;
    };

    // Send the initial board as a reply to the slash command
    await interaction.reply({
      content: "Tic Tac Toe started! Click on a button to play!",
      components: createGrid(),
    });

    // Check if the interaction is happening in a channel; DMs are not allowed for this game
    if (!interaction.channel) {
      await interaction.followUp({
        content: "This command cannot be used in DMs or outside of a channel!",
        ephemeral: true, // Sends the message only to the user
      });
      return;
    }

    // Filter to only accept button clicks related to the Tic Tac Toe game (those starting with 'ttt_')
    const filter = (i) => {
      return i.customId.startsWith("ttt_");
    };

    // Create a collector to handle button interactions (players clicking on grid cells)
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button, // Only collect button interactions
      time: 60000, // Set a timeout of 1 minute for the game
    });

    // Handle each button click event (move)
    collector.on("collect", async (i) => {
      const [_, row, col] = i.customId.split("_"); // Extract row and column from the button's custom ID
      const rowIndex = parseInt(row); // Convert row string to integer
      const colIndex = parseInt(col); // Convert column string to integer

      await i.deferUpdate(); // Acknowledge the button click to prevent timeouts

      // If the selected square is already taken, send a message and do nothing
      if (board[rowIndex][colIndex] !== "⬜") {
        await i.followUp({
          content: "This square is already taken!",
          ephemeral: true, // Message is only visible to the player who tried to click
        });
        return;
      }

      // Update the board with the current player's move
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
        // If the game is a draw, disable all buttons and announce the draw
        await interaction.editReply({
          content: "It's a draw! 🤝",
          components: createGrid().map((row) => {
            row.components.forEach((button) => button.setDisabled(true)); // Disable all buttons
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

    // When the game times out (after 1 minute of inactivity), disable the board and end the game
    collector.on("end", async () => {
      await interaction.editReply({
        content: "Tic Tac Toe game ended.", // Notify that the game has ended
        components: [], // Remove all buttons to prevent further interaction
      });
    });
  },
};
