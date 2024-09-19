import getOpenAIResponse from "../openai/get-ai-response.js";

async function replyDiscord(contentToSend, originalMessage) {
  try {
    await originalMessage.channel.send(contentToSend);
  } catch (error) {
    await originalMessage.channel.send("Sorry, something went wrong");
    console.error("Error processing OpenAI response:", error);
  }
}

export default replyDiscord;
