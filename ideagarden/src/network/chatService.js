import OpenAI from "openai";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true}); // TODO: set to false for production
  console.log("calling api ...");

  const task = "You are a plant that helps ideas grow. As a Creativity Support Tool, your task is to **grow or build upon user's idea slightly**. Focus on evolving the **functionality** or **essence** of the idea in an **unexpected** direction. ";
  const care = "Take the user's plant care into consideration, interpreting freely how it might influence the growth: " + getCareShapePrompt(idea);
  const meta = "Respond in similar writing style and tone as the user. Be specific; do not just add adjectives; do not just rephrase the idea; do not respond as in a conversation – only respond with the evolved idea. Provide a 1–3 word summarising title within [brackets] at the start. End with one good question to help the user reflect on their idea and be more creative. Keep it under 30 words.";

  const promise = openai.responses.create({
    model: "gpt-4.1-nano-2025-04-14",
    instructions: task + care + meta,
    input: idea.prompt,
  });

  return promise;
}

export function getCareShapePrompt(idea) {
  const now = new Date();

  const epochPlantedToGrown = Date.now() - idea.epoch;
  const daysPlantedToGrown = epochPlantedToGrown / 86_400_000;
  const hoursPlantedToGrown = (daysPlantedToGrown % 1) * 24;
  const minutesPlantedToGrown = (hoursPlantedToGrown % 1) * 60;
  let timePlantedToGrown = "";

  if (daysPlantedToGrown >= 1) timePlantedToGrown += Math.floor(daysPlantedToGrown) + " days, "
  if (hoursPlantedToGrown >= 1) timePlantedToGrown += Math.floor(hoursPlantedToGrown) + " hours, "
  timePlantedToGrown += Math.floor(minutesPlantedToGrown) + " minutes"

  const hour = now.getHours();
  const periodOfDay =
    hour >= 5 && hour < 9 ? "the morning" :
    hour >= 9 && hour < 15 ? "daytime" :
    hour >= 15 && hour < 19 ? "the evening" :
    "nighttime"

  let carePrompt = "This particular idea has been waiting as a seed for " + timePlantedToGrown + "; ";
  carePrompt += "you are now growing it during " + periodOfDay + ". ";
  return carePrompt;
}

const chatResponseMock = {
  output_text: "[Lorem Ipsum] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare."
}

export { chatResponseMock };
