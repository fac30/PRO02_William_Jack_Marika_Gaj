import replyDiscord from "./reply-discord.js";
import client from "../index.js";

// Function to handle OpenAI response
// takes the user message and clean it using regular expression and trim
async function cleanMessage(message) {
  let cleanContent = message.content;

  return cleanContent
    .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
    .trim();
}

export default cleanMessage;
