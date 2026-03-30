const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeReadmeWithAI(readmeText) {
  try {
    const shortText = readmeText.slice(0, 4000);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer reviewing GitHub repositories.",
        },
        {
          role: "user",
          content: `
Analyze this README and give short feedback:

1. What is good
2. What is missing
3. How to improve it

README:
${shortText}
          `,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI ERROR:", error.message);
    return "AI analysis is currently unavailable.";
  }
}

module.exports = { analyzeReadmeWithAI };