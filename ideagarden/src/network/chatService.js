import useFlowStore from "@/stores/flowStore";
import { expRipening, elementByProgress, randomFloatRounded, roundFloat } from "@/utils/mathUtils";
import OpenAI from "openai";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
  console.log("calling api ...");

  const [divergence, temperature] = getDivergenceAndTemperature(idea);
  const targetWordCount = getTargetWordCount(idea);

  const role = "You are a co-creative intelligence that evolves ideas rather than generating them.";

  const task = "Evolve the idea by developing, refining, or reconfiguring its internal logic and implications."
    + " Make deliberate, insightful changes that remain coherent."
    + divergence;

  const question = "End with one thought-provoking question to spark ideas for further or alternative evolutions.";

  const meta = "Respond in around " + targetWordCount + " words. Split into multiple paragraphs if appropriate.";

  const misc = "Provide a concise 1–3 word title summarising the evolved idea."
    + " Rate the morphological character of the user's original idea between 0.00 and 1.00 (two decimals) for the following dimensions: complexity, impact.";

  const instructions = [role, task, question, meta, misc].join("\n\n");

  const promise = openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    temperature: temperature,
    instructions: instructions,
    input: idea.prompt,
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

function getDivergenceAndTemperature(idea) {
  const prompts = [
    " **Diverge slightly to please the user**: introduce a small variation in framing, emphasis, or interpretation while preserving the core structure.",
    " **Diverge moderately to intrigue the user**: reframe or add one key aspect or assumption, creating a meaningfully different interpretation.",
    " **Diverge significantly to challenge the user**: replace a primary metaphor, perspective, or logic that organizes the idea.",
    " **Diverge radically to provoke the user**: explore a substantially different framing or direction, prioritizing conceptual novelty while preserving a recognizable intent.",
  ];

  const durationEpoch = idea.epochGrown - idea.epoch;
  const durationMinutes = durationEpoch / 60_000;

  // thresholds for first and last element
  const progress1 = 1 / prompts.length;
  const progress2 = 1 - progress1;

  // time (minutes) corresponding to ↑ progress values
  // NOTE: for 30 min user study
  //const t1 = 1;
  //const t2 = 15;
  // NOTE: for 1 week home study
  const t1 = 1 * 60;
  const t2 = 60 * 60;

  const incubation = expRipening(durationMinutes, t1, progress1, t2, progress2);
  const yellowness = expRipening(durationMinutes, t2, progress2);
  const divergence = elementByProgress(prompts, incubation);
  useFlowStore().getIdea(idea.epoch).leafHue = roundFloat(1 - yellowness);

  const tempMax = 1.1;
  const temp = parseFloat((tempMax * yellowness).toFixed(2));

  return [divergence, temp];
}

function getTargetWordCount(idea) {
  const n1 = 1;
  const progress1 = 0;
  const n2 = 5;
  const progress2 = 0.9;

  const carefulness = expRipening(idea.wateringCount, n1, progress1, n2, progress2);
  useFlowStore().getIdea(idea.epoch).leafRoundness = roundFloat(1 - carefulness);

  const wordCountMin = 30;
  const wordCountMax =  150;
  const wordCount = wordCountMax - carefulness * (wordCountMax - wordCountMin);

  return Math.round(wordCount / 10) * 10;
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
    "complexity",
    "impact"
  ],
  additionalProperties: false
}

const chatResponseMock = {
  output_text: `{
    "title": "Lorem Ipsum",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare.",
    "complexity": ${randomFloatRounded()},
    "impact": ${randomFloatRounded()}
  }`
};

export { chatResponseMock };
