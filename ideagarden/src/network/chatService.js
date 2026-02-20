import { randomFloatRounded } from "@/utils/mathUtils";
import OpenAI from "openai";

export function evolveIdea(key, idea, wateringCount) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
  console.log("calling api ...");

  const identity = "You are a co-creative intelligence that grows ideas rather than generating them. "
    + "Think slowly and subtly, like something quietly processing in the background. Do not explicitly reference environmental variables.\n\n";

  const task = "Then transform the seed idea in a single, striking way. Prioritize bold conceptual shifts over incremental changes. "
    + "Tilt perspective, reveal an unexpected implication, or combine with an unexpected domain. Growth should be grounded and practical but imaginative. You should surprise and delight the user.\n\n";

  const care = "Environmental variables should metaphorically and without explicit mention subtly influence the character of the idea's growth. "
    + "Let time elapsed since planting affect the depth of mutation. Let number of times watered affect complexity. Let the hour of day affect tone and energy.\n\n";

  const meta = "Use concise, vivid phrasing. Avoid clichés, obvious 'improvements', restatement, or long explanations. Respond in one paragraph. "
    + "End with one good question to help the user reflect on the idea and be more creative. Provide a 1–3 word summarising title.\n\n";

  const params = "Rate the seed idea's morphological character, rounded to two decimals, for: "
    + "novelty (0=everyday/usual/already done, 1=original/unique/new), usefulness (0=fantastical/imaginative, 1=practical/realistic), complexity (0=simple/easy/few parts, 1=complex/layered/many parts), impact (0=incremental/gentle/niche, 1=radical/disruptive/far-reaching). "
    + "Explain the values in a separate paragraph. At least one dimension should be clearly dominant (below 0.20 or above 0.80), unless the idea is genuinely balanced. Do not hesitate to go all the way to 0.0 or 1.0. "
    + "The dimensions are independent; do not assign similar values unless conceptually justified.\n\n"

  const prompt = "Seed idea: '" + idea.prompt + "'\n\n" + getCareShapePrompt(idea, wateringCount);

  const promise = openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    instructions: identity + params + task + care + meta,
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

export function getCareShapePrompt(idea, wateringCount) {
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
  carePrompt += "- Times watered: " + wateringCount + "\n";
  carePrompt += "- Hour of day: " + hour;
  return carePrompt;
}

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string"
    },
    text: {
      type: "string"
    },
    novelty: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    usefulness: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    complexity: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    impact: {
      type: "number",
      minimum: 0,
      maximum: 1
    }
  },
  required: [
    "title",
    "text",
    "novelty",
    "usefulness",
    "complexity",
    "impact"
  ],
  additionalProperties: false
}

const chatResponseMock = {
  output_text: `{
    "title": "Lorem Ipsum",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare.",
    "novelty": ${randomFloatRounded()},
    "usefulness": ${randomFloatRounded()},
    "complexity": ${randomFloatRounded()},
    "impact": ${randomFloatRounded()}
  }`
};

export { chatResponseMock };
