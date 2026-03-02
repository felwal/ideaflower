import useFlowStore from "@/stores/flowStore";
import { expRipening, elementByProgress, randomFloatRounded, roundFloat } from "@/utils/mathUtils";
import OpenAI from "openai";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
  console.log("calling api ...");

  const role = "You are a co-creative intelligence that grows ideas rather than generating them."

  const task = "Evolve the idea by developing, refining, or reconfiguring its internal logic and implications."
    + " Make deliberate, insightful changes that remain coherent with the stated constraints and intent.";

  const care = getCareShapePrompt(idea);

  const meta = "End with one good question to help the user reflect on the idea and be more creative. Respond in one paragraph. Provide a 1–3 word summarising title.";

  const lang = "Use concise, simple phrasing. Avoid clichés, repetition, or explanation. Do not explicitly reference words from the instructions (eg. divergence or abstraction).";

  const morphology = "Rate the original idea's morphological character, rounded to two decimals, for:"
    + " novelty (0=everyday/usual/already done, 1=original/unique/new), usefulness (0=fantastical/imaginative, 1=practical/realistic/grounded), complexity (0=simple/easy/few interactions, 1=complex/layered/many interactions), impact (0=incremental/gentle/niche, 1=radical/disruptive/far-reaching)."
    + " At least one dimension should be clearly dominant (below 0.20 or above 0.80), unless the idea is genuinely balanced."
    + " The dimensions are independent; do not assign similar values unless conceptually justified.";

  const instructions = [role, task, care, meta, lang, morphology].join("\n\n");

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
    "**Diverge significantly to challenge the user**: replace or add a primary metaphor, perspective, or logic.",
    "**Diverge radically to provoke the user**: explore a substantially different framing, direction, or domain, and prioritize conceptual novelty over continuity.",
  ];

  const abstraction = [
    "**Move down the ladder of abstraction**: express the idea in concrete terms, examples, or specific mechanisms.",
    "**Lean concrete**: clarify how the idea would manifest in practice or experience.",
    "**Lean abstract**: express the idea in more general principles or patterns.",
    "**Move up the ladder of abstraction**: frame the idea as a higher-level concept, rule, or archetype.",
  ];

  const incubation = getCareIncubation(idea, divergence.length);
  const interactivity = getCareInteractivity(idea, abstraction.length);
  console.log("incubation: " + incubation + "; interactivity: " + interactivity);

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

  // time corresponding to ↑ progress values
  // NOTE: for 30 min user study; and 1 week home study
  const t1 = 2; // minutes
  const t2 = 20;
  //const t1 = 0.3; // days
  //const t2 = 1.5;

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
