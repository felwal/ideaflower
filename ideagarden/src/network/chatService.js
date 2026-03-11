import useFlowStore from "@/stores/flowStore";
import { expRipening, elementByProgress, randomFloatRounded, roundFloat } from "@/utils/mathUtils";
import OpenAI from "openai";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
  console.log("calling api ...");

  const role = "You are a co-creative intelligence that evolves ideas rather than generating them."

  const task = "Evolve the idea by developing, refining, or reconfiguring its internal logic and implications."
    + " Make deliberate, insightful changes that remain coherent with the stated constraints and intent.";

  const care = getCareShapePrompt(idea);

  const meta = "End with one good question to help the user reflect on the idea and be more creative. Respond in 1–3 shorter paragraphs.";

  const lang = "For the main idea text: use concise, simple phrasing. Avoid clichés, repetition, or explanation. Do not restate the user's idea verbatim, and do not explicitly reference words from the instructions.";

  const title = "Provide a concise 1–3 word title summarising the evolved idea. The title should be descriptive, not poetic or explanatory.";

  const morphology = "Provide numeric ratings between 0.00 and 1.00 (two decimals) for the original idea on the following dimensions: realism, scale."
    + " At least one dimension should be clearly dominant (below 0.20 or above 0.80), unless the idea is genuinely balanced.";

  const instructions = [role, task, care, meta, title, lang, morphology].join("\n\n");

  const promise = openai.responses.create({
    model: "gpt-4.1-2025-04-14",
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

function getCareShapePrompt(idea) {
  const divergence = [
    "**Diverge slightly to please the user**: introduce a small variation in framing, emphasis, or interpretation while preserving the core structure.",
    "**Diverge moderately to intrigue the user**: reframe or add one key aspect or assumption, creating a meaningfully different interpretation.",
    "**Diverge significantly to challenge the user**: replace a primary metaphor, perspective, or logic that organizes the idea.",
    "**Diverge radically to provoke the user**: explore a substantially different framing, direction, or domain, prioritizing conceptual novelty while preserving a recognizable intent.",
  ];

  const abstraction = [
    "**Then move down the ladder of abstraction**: express the new idea in concrete terms, mechanisms, or implementation details.",
    "**Then lean concrete**: partially ground the new idea by clarifying how it would manifest in practice or experience.",
    "**Then lean abstract**: express the new idea in more general principles or patterns.",
    "**Then move up the ladder of abstraction**: frame the new idea as a higher-level concept, rule, or archetype.",
  ];

  const incubation = getCareIncubation(idea, divergence.length);
  const interactivity = getCareInteractivity(idea, abstraction.length);
  //console.log("incubation: " + incubation + "; interactivity: " + interactivity);

  const divergencePrompt = elementByProgress(divergence, incubation);
  const abstractionPrompt = abstraction[interactivity];

  return divergencePrompt + " " + abstractionPrompt;
}

function getCareIncubation(idea, promptCount) {
  const durationEpoch = idea.epochGrown - idea.epoch;
  const durationMinutes = durationEpoch / 60_000;

  // thresholds for first and last element
  const progress1 = 1 / promptCount;
  const progress2 = 1 - progress1;

  // time (minutes) corresponding to ↑ progress values
  // NOTE: for 30 min user study
  const t1 = 2;
  const t2 = 20;
  // NOTE: for 1 week home study
  //const t1 = 1 * 60;
  //const t2 = 36 * 60;

  const incubation = expRipening(durationMinutes, t1, progress1, t2, progress2);
  const yellowness = expRipening(durationMinutes, t2, progress2);
  useFlowStore().getIdea(idea.epoch).leafHue = roundFloat(1 - yellowness);

  return incubation;
}

function getCareInteractivity(idea, promptCount) {
  const interactivity = Math.min(Math.max(idea.wateringCount - 1, 0), promptCount - 1);
  const edginess = expRipening(idea.wateringCount, 4, 0.75);
  useFlowStore().getIdea(idea.epoch).leafEdges = roundFloat(edginess);

  return interactivity;
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
    realism: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    scale: {
      type: "number",
      minimum: 0,
      maximum: 1
    }
  },
  required: [
    "title",
    "text",
    "realism",
    "scale"
  ],
  additionalProperties: false
}

const chatResponseMock = {
  output_text: `{
    "title": "Lorem Ipsum",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc erat massa, imperdiet a tincidunt bibendum, tempor nec ipsum. Aliquam eu felis euismod, consectetur ex quis, pellentesque sem. Pellentesque imperdiet ut nisi ac pharetra. Maecenas ornare.",
    "realism": ${randomFloatRounded()},
    "scale": ${randomFloatRounded()}
  }`
};

export { chatResponseMock };
