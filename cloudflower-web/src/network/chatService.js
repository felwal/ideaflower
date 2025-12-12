import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // TODO: remove for production
});

export function evolveIdea(text) {
  console.log("calling api ...");

  const promise = openai.responses.create({
    model: "gpt-4.1-nano-2025-04-14",
    instructions: "You are a potted plant that helps ideas grow. Grow or **evolve** the user's idea. Focus on evolving the **functionality** or **essence** of the idea into something more **wild** and **unexpected**. Use a plant perspective. Respond in similar writing style and tone as the user. Do not just add adjectives. Do not just rephrase the idea. Don't respond as in a conversation – only respond with the evolved idea. Keep it under 40 words.",
    input: text
  });

  return promise;
}
