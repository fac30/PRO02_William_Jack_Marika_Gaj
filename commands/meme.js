// Import the SlashCommandBuilder from discord.js to create a slash command
import { SlashCommandBuilder } from 'discord.js';

export default {
    // Define the slash command with the name 'meme' and a description
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('generating meme!'),

    // The execute function runs when the command is used
    async execute(interaction) {
        try {
            // Send a message to the user that the image is loading
            await interaction.reply('loading image');
            
            // Fetch memes from the Imgflip API
            const response = await fetch('https://api.imgflip.com/get_memes', {
                method: 'GET', // Correct the 'Method' to lowercase 'method'
            });

            // Check if the response is not successful (status code is not in the range of 200-299)
            if (!response.ok) {
                // If not successful, throw an error
                throw new Error('error could not fetch meme');
            } else {
                // Parse the response JSON to get the data 
                const data = await response.json();

                // Generate a random number to select a random meme
                const randomiser = Math.floor(Math.random() * data.data.memes.length);
       

                // Edit the reply to include the meme URL and name
                await interaction.editReply(data.data.memes[randomiser].url + '\n' + data.data.memes[randomiser].name);
            }
        } catch (error) {
            // If there's an error, log it to the console
            console.log(error);
        }
    },
};

