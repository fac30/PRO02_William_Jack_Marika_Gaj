import OpenAI from "openai";
import dotenv from "dotenv"; // Import dotenv using ES6 syntax
dotenv.config(); // Configure dotenv to load .env file

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getOpenAIResponse(messageToAI) {
  try {
    console.log("Getting AI response:");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: messageToAI },
      ],
      max_tokens: 150,
    });

    console.log("OpenAI Response:", completion.choices[0].message.content);
    //return openAi response
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error with OpenAI API:",
      error.response ? error.response.data : error.message || error
    );
  }
}

export default getOpenAIResponse;
