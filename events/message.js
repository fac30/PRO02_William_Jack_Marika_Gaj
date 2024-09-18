import cleanMessage from "../openai/clean-message.js";
import { handlePersonalityChange } from "../openai/personalities.js";

// Function to handle messages
async function handleMessage(message) {
  if (message.author.bot) return;

  const prefix = "!";
  const content = message.content.trim();
  console.log(`Received message: ${content}`);

  if (message.content.startsWith(prefix)) {
    await cleanMessage(message);
  } else if (message.content.startsWith("-")) {
    handlePersonalityChange(message.content);
  }
}

export default handleMessage;
