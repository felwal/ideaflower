import "@/css/home.css";
import useFlowStore from "@/stores/flowStore";
import { ArrowUp } from 'lucide-vue-next';
import blobshape from "blobshape";
import { randomInt, randomBool } from "@/utils/mathUtils";

export default function HomeView(props) {
  function sendPrompt() {
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput.value.trim();

    if (prompt === "") return;

    promptInput.value = "";
    props.onSendPrompt(prompt);
  }

  function addPromptOnKeyACB(evt) {
    if (evt.key === "Enter") {
      sendPrompt();
    }
  }

  function addPromptOnClickACB(evt) {
    sendPrompt();
  }

  function renderIdea(idea) {
    function renderPlant() {
      const sStart =  24;
      const sEnd =  100;
      const lStart =  85;
      const lEnd =  50;
      const s = sStart + (sEnd - sStart) * idea.potSaturation;
      const l = lStart + (lEnd - lStart) * idea.potSaturation;

      const potColor = "hsl(from var(--color-pot) h " + s + " " + l + ")";
      const potColorDark = "hsl(from " + potColor + " h s 35)";

      if (!idea.leafPath) {
        const {path} = blobshape({size: 100, growth: randomInt(5, 7), edges: randomInt(9, 15)});
        idea.leafPath = path;
      }

      return (
        <div class="plant">
          <div class={"plant__leaves" + (idea.result ? "" : " hidden") }>
            <svg width="100%" height="auto" viewBox="0 0 100 100">
              <path d={idea.leafPath} fill="url(#paint0_linear_685_1341)"/>
              <defs>
                <linearGradient id="paint0_linear_685_1341" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--color-primary-light)"/>
                <stop offset="1" stop-color="var(--color-primary-dark)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="plant__pot__back">
            <svg width="100%" height="auto" viewBox="0 0 46 3" fill="none">
              <path d="M23 0C35.7025 0 46 1.34315 46 3H0C0 1.34315 10.2975 0 23 0Z" fill={potColorDark}/>
            </svg>
          </div>
          <div class="plant__pot__front">
            <svg width="100%" height="auto" viewBox="0 0 46 27" fill="none">
              <ellipse cx="23" cy="24" rx={idea.potWide ? "19" : "13"} ry="3" fill={potColor}/>
              <path d={idea.potWide ? "M0 0H46L42 24H4L0 0Z" : "M0 0H46L36 24H10L0 0Z"} fill={potColor}/>
              <path d="M46 0C46 1.65685 35.7025 3 23 3C10.2975 3 0 1.65685 0 0H46Z" fill={potColorDark}/>
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div class="item">
        {renderPlant()}
        <h3 class="item__name">{idea.name || "???"}</h3>
        <p class="item__date">{new Date(idea.epoch).toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div class="home-view">
      <div class="home-content">
        <h1>Home</h1>
        <p>Water level: {props.waterLevel}</p>
        <div class="stack">
          {props.ideas.reverse().map(renderIdea)}
        </div>
      </div>

      <div class="home-footer">
        <div class="composer column">
          <input class="composer__input" id="prompt" type="text" placeholder="Plant an idea ..." onKeydown={addPromptOnKeyACB} disabled={!useFlowStore().user} />
          <button class="composer__button" onClick={addPromptOnClickACB} disabled={!props.isSignedIn}>
            <ArrowUp color="var(--color-text-primary)" />
          </button>
        </div>
      </div>
    </div>
  );
}
