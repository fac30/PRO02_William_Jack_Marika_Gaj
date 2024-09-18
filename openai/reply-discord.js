import getOpenAIResponse from "./get-ai-response.js";

async function replyDiscord(contentToSend, originalMessage) {
  try {
    // then call getOpenAi response with the cleancontent variable
    const reply = await getOpenAIResponse(contentToSend);
    // send reply back to discord channel
    await originalMessage.channel.send(reply);
  } catch (error) {
    await originalMessage.channel.send("Sorry, something went wrong");
    console.error("Error processing OpenAI response:", error);
  }
}

export default replyDiscord;
