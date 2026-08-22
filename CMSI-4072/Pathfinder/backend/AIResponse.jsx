import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "api-KEY",
  dangerouslyAllowBrowser: true,
});


export async function getAIResponse(userMessage) {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Error calling OpenAI:", err);
    throw err;
  }
}
