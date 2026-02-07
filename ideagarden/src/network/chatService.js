import OpenAI from "openai";

export function evolveIdea(key, prompt) {
  const openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true // TODO: remove for production
  });

  console.log("calling api ...");

  const promise = openai.responses.create({
    model: "gpt-4.1-nano-2025-04-14",
    instructions: "You are a plant that helps ideas grow. As a Creativity Support Tool, your task is to **grow or evolve the user's idea slightly**. Focus on evolving the **functionality** or **essence** of the idea in an **unexpected** direction. Respond in similar writing style and tone as the user. Be specific. Do not just add adjectives. Do not just rephrase the idea. Don't respond as in a conversation – only respond with the evolved idea. Provide a 1–3 word summarising title within [brackets] at the start. End with one good question to help the user reflect on their idea and be more creative. Keep it under 30 words.",
    input: prompt,
  });

  return promise;
}

const chatResponseMock = {
  output_text: "[Lorem Ipsum] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare."
}

export { chatResponseMock };
