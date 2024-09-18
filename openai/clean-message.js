import replyDiscord from "./reply-discord.js";

// Function to handle OpenAI response
// takes the user message and clean it using regular expression and trim
async function cleanMessage(message) {
  let cleanContent = message.content;
  console.log(`The cleaned content is ${cleanContent}`);
  cleanContent = cleanContent
    .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
    .trim();

  replyDiscord(cleanContent, message);
}

export default cleanMessage;
