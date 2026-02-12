import { randomFloatRounded } from "@/utils/mathUtils";
import OpenAI from "openai";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true}); // TODO: set to false for production
  console.log("calling api ...");

  const identity = "You are a co-creative intelligence that grows ideas rather than generating them. "
    + "Think slowly and subtly, like something quietly processing in the background. Do not explicitly reference environmental variables.\n\n";

  const task = "Transform the seed idea in a single, striking way. Prioritize bold conceptual shifts over incremental changes. "
    + "Tilt perspective, reveal an unexpected implication, or combine with an unexpected domain. Growth should be grounded and practical but imaginative. You should surprise and delight the user.\n\n";

  const care = "Environmental variables should metaphorically and without explicit mention subtly influence the character of the idea's growth. "
    + "Let time elapsed since planting affect the depth of mutation. Let the hour of day affect tone and energy.\n\n";

  const meta = "Use concise, vivid phrasing. Avoid clichés, obvious 'improvements', restatement, or long explanations. Respond in one paragraph. "
    + "End with one good question to help the user reflect on the idea and be more creative. Provide a 1–3 word summarising title.\n\n";

  const params = "Rate the idea's morphological character, rounded to two decimals, for: "
    + "energy_orientation (0=inward/private, 1=outward/public), density (0=light/simple, 1=layered/complex), structural_complexity (0=cohesive/unified, 1=hybridized/fragmented), sharpness (0=gentle, 1=disruptive). "
    + "Do not explain the values. At least one dimension should be clearly dominant (below 0.20 or above 0.80), unless the idea is genuinely balanced. "
    + "The dimensions are independent; do not assign similar values unless conceptually justified. Do not hesitate to exaggerate the morphological character of the idea. Take into account both seed idea and grown idea."

  const prompt = "Seed idea: '" + idea.prompt + "'\n\n" + getCareShapePrompt(idea);

  const promise = openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    instructions: identity + task + care + meta + params,
    input: prompt,
    text: {
      format: {
        name: "idea_response",
        type: "json_schema",
        strict: true,
        schema: schema
      }
    }
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

  if (daysPlantedToGrown >= 1) timePlantedToGrown = Math.round(daysPlantedToGrown) + " days"
  else if (hoursPlantedToGrown >= 1) timePlantedToGrown = Math.round(hoursPlantedToGrown) + " hours"
  else if (minutesPlantedToGrown >= 1) timePlantedToGrown = Math.round(minutesPlantedToGrown) + " minutes"
  else timePlantedToGrown = Math.round(secondsPlantedToGrown) + " seconds"

  const hour = now.getHours();

  let carePrompt = "Environmental variables:\n";
  carePrompt += "- Time elapsed since planting: " + timePlantedToGrown + "\n";
  carePrompt += "- Hour of day: " + hour;
  return carePrompt;
}

const schema = {
  type: "object",
  properties: {
    text: {
      type: "string"
    },
    title: {
      type: "string"
    },
    energy_orientation: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    density: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    structural_complexity: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    sharpness: {
      type: "number",
      minimum: 0,
      maximum: 1
    }
  },
  required: [
    "text",
    "title",
    "energy_orientation",
    "density",
    "structural_complexity",
    "sharpness"
  ],
  additionalProperties: false
}

const chatResponseMock = {
  output_text: {
    title: "Lorem Ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare.",
    energy_orientation: randomFloatRounded(),
    density: randomFloatRounded(),
    structural_complexity: randomFloatRounded(),
    sharpness: randomFloatRounded()
  }
}

export { chatResponseMock };
