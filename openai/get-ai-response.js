// Function to get OpenAI response
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
