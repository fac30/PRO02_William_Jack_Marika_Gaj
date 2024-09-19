import cleanMessage from "./clean-message.js";
import { handlePersonalityChange } from "../openai/personalities.js";
import getOpenAIResponse from "../openai/get-ai-response.js";
import replyDiscord from "./reply-discord.js";

// Function to handle messages
async function handleMessage(message) {
  if (message.author.bot) return;
  // If the user has started their message with !
  if (message.content.startsWith("!")) {
    // Clean the message content
    const cleanedMessage = await cleanMessage(message);
    // Get the OpenAI reponse to the message
    const AiResponse = await getOpenAIResponse(cleanedMessage);
    // Send that response to the channel of the original message
    replyDiscord(AiResponse, message);
    // If user has started their message with -
  } else if (message.content.startsWith("-")) {
    // Change the OpenAI personality to the message that the user has entered
    handlePersonalityChange(message.content);
  }
}

export default handleMessage;
