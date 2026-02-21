import { elementByProgress, randomFloatRounded } from "@/utils/mathUtils";
import OpenAI from "openai";
import { getPosition } from "suncalc";

export function evolveIdea(key, idea) {
  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
  console.log("calling api ...");

  const identity = "You are a co-creative intelligence that grows ideas rather than generating them. "
    + "Think slowly and subtly, like something quietly processing in the background.\n\n";

  const task = "Evolve the user's idea by extending, refining, or reconfiguring its internal logic and implications. Changes should be intentional and coherent. "
    + getCareShapePrompt(idea);

  const meta = "Use concise, vivid phrasing. Avoid clichés, restatement, or long explanations. End with one good question to help the user reflect on the idea and be more creative. "
    + "Respond in one paragraph. Provide a 1–3 word summarising title.\n\n";

  const morphology = "Rate the original idea's morphological character, rounded to two decimals, for: "
    + "novelty (0=everyday/usual/already done, 1=original/unique/new), usefulness (0=fantastical/imaginative, 1=practical/realistic/grounded), complexity (0=simple/easy/few interactions, 1=complex/layered/many interactions), impact (0=incremental/gentle/niche, 1=radical/disruptive/far-reaching). "
    + "At least one dimension should be clearly dominant (below 0.20 or above 0.80), unless the idea is genuinely balanced. Do not hesitate to go all the way to 0.0 or 1.0. "
    + "The dimensions are independent; do not assign similar values unless conceptually justified.\n\n"

  const instructions = identity + task + meta + morphology;

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
  const novelty = [
    "Preserve framing: maintain the core assumptions, domain, and metaphors of the original idea.",
    "Diverge slightly: introduce a single new analogy or reframing while keeping the core structure intact.",
    "Diverge moderately: shift the perspective, domain, or framing so the idea is interpreted in a new way.",
    "Diverge significantly: replace the primary metaphor or domain and prioritize conceptual novelty over continuity.",
    "Diverge radically: discard core assumptions and reconstruct the idea from a distant or unexpected domain.",
  ];

  const complexity = [
    "Simplify significantly: collapse the idea to a single rule, mechanism, or interaction that captures its essence.",
    "Simplify slightly: remove secondary components while preserving the main behavior or intent.",
    "Increase complexity slightly: introduce a small number of interacting parts, roles, or dependencies.",
    "Increase complexity significantly: add layered subsystems, roles, or feedback between components.",
    "Increase complexity radically: introduce multiple interacting feedback loops that produce emergent behavior over time.",
  ];

  const usefulness = [
    "Shift toward the fantastical: treat the idea as symbolic, narrative, or speculative, unconstrained by real-world feasibility.",
    "Lean fantastical: relax real-world constraints and allow imaginative elements to shape the idea.",
    "Preserve balance: maintain the current mix of realistic and fantastical elements without shifting the mode.",
    "Lean grounded: anchor the idea more firmly in real-world constraints, plausibility, and causal logic.",
    "Shift toward the grounded: make the idea operational, concrete, and implementable within real-world conditions.",
  ];

  const incubation = getCareIncubation(idea, novelty.length);
  const interactivity = getCareInteractivity(idea, complexity.length);
  const energy = getCareEnergy(idea);

  console.log("incubation: " + incubation + "; interactivity: " + interactivity + "; energy: " + energy);

  const noveltyPrompt = elementByProgress(novelty, incubation);
  const complexityPrompt = complexity[interactivity];
  const usefulnessPrompt = elementByProgress(usefulness, energy);

  return noveltyPrompt + " " + complexityPrompt + " " + usefulnessPrompt + "\n\n";
}

function getCareIncubation(idea, promptCount) {
  const epochPlantedToGrown = idea.epochGrown - idea.epoch;
  const minutesPlantedToGrown = epochPlantedToGrown / 60_000;

  // progress thresholds for first and last element
  const q1 = 1 / promptCount;
  const q2 = 1 - q1;

  // time corresponding to q1 and q2
  const t1 = 10; // minutes
  const t2 = 1.5 * 24 * 60; // 1.5 days

  const q0 = 1 - Math.abs(q1 - 1) ** (t2 / (t2 - t1)) / Math.abs(q2 - 1) ** (t1 / (t2 - t1));
  const l = ((q1 - 1) / (q0 - 1)) ** (1 / t1);

  // asymptote at y=1 when x->inf
  const incubation = Math.max(1 - (1 - q0) * l ** minutesPlantedToGrown, 0);

  return incubation;
}

function getCareInteractivity(idea, promptCount) {
  return Math.min(Math.max(idea.wateringCount - 1, 0), promptCount - 1);
}

function getCareEnergy(idea) {
  const sunPos = getPosition(new Date(idea.epochGrown), 59.347, 18.074);
  const sunAlt = sunPos.altitude;
  const sunProgress = (sunAlt + Math.PI / 2) / Math.PI; // 1 at zenith, 0.5 at horizon

  console.log("sunAlt: " + sunAlt);

  return sunProgress;
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
