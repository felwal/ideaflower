import OpenAI from "openai";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true}); // TODO: set to false for production
  console.log("calling api ...");

  const identity = "You are a co-creative intelligence that grows ideas rather than generating them. "
    + "Think slowly and subtly, like something quietly processing in the background. Do not explicitly reference environmental variables.\n\n";

  const task = "Transform the seed idea in a single, striking way. Prioritize bold conceptual shifts over incremental changes. "
    + "Tilt perspective, reveal an unexpected implication, or combine with an unexpected domain. Growth should be grounded and practical but imaginative. You should surprise and delight the user.\n\n";

  const care = "Environmental variables should metaphorically and without explicit mention subtly influence the character of the idea's growth. "
    + "Let time elapsed since planting affect the depth of mutation. Let time of day affect tone and energy.\n\n";

  const meta = "Use concise, vivid phrasing. Avoid clichés, obvious 'improvements', restatement, or long explanations. Respond in one paragraph. "
    + "Provide a 1–3 word summarising title within [brackets] at the start. End with one good question to help the user reflect on the idea and be more creative.\n\n";

  const prompt = "Seed idea: '" + idea.prompt + "'\n\n" + getCareShapePrompt(idea);

  const promise = openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    instructions: identity + task + care + meta + params,
    input: prompt,
  });

  return promise;
}

export function getCareShapePrompt(idea) {
  const now = new Date();

  const epochPlantedToGrown = Date.now() - idea.epoch;
  const daysPlantedToGrown = epochPlantedToGrown / 86_400_000;
  const hoursPlantedToGrown = (daysPlantedToGrown % 1) * 24;
  const minutesPlantedToGrown = (hoursPlantedToGrown % 1) * 60;
  const secondsPlantedToGrown = (minutesPlantedToGrown % 1) * 60;
  let timePlantedToGrown = "";

  if (daysPlantedToGrown >= 1) timePlantedToGrown = Math.floor(daysPlantedToGrown) + " days"
  else if (hoursPlantedToGrown >= 1) timePlantedToGrown = Math.floor(hoursPlantedToGrown) + " hours"
  else if (minutesPlantedToGrown >= 1) timePlantedToGrown = Math.floor(minutesPlantedToGrown) + " minutes"
  else timePlantedToGrown = Math.floor(secondsPlantedToGrown) + " seconds"

  const hour = now.getHours();
  const periodOfDay =
    hour >= 5 && hour < 10 ? "morning" :
    hour >= 10 && hour < 16 ? "daytime" :
    hour >= 16 && hour < 20 ? "evening" :
    "night"

  let carePrompt = "Environmental variables:\n";
  carePrompt += "- Time elapsed since planting: " + timePlantedToGrown + "\n";
  carePrompt += "- Time of day: " + periodOfDay;
  return carePrompt;
}

const chatResponseMock = {
  output_text: "[Lorem Ipsum] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare."
}

export { chatResponseMock };
