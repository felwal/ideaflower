import "@/css/home.css";
import useFlowStore from "@/stores/flowStore";
import { ArrowUp } from 'lucide-vue-next';

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
    return (
      <div class="item">
        <div class="plant">
          <div class={"plant__leaves" + (idea.result ? "" : " hidden") }></div>
          <div class="plant__pot__back">
            <svg width="100%" height="auto" viewBox="0 0 46 3" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 0C35.7025 0 46 1.34315 46 3H0C0 1.34315 10.2975 0 23 0Z" fill="#A2691A"/>
            </svg>
          </div>
          <div class="plant__pot__front">
            <svg width="100%" height="auto" viewBox="0 0 46 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="23" cy="24" rx="13" ry="3" fill="#D98B1F"/>
              <path d="M0 0H46L36 24H10L0 0Z" fill="#D98B1F"/>
              <path d="M46 0C46 1.65685 35.7025 3 23 3C10.2975 3 0 1.65685 0 0H46Z" fill="#A2691A"/>
            </svg>
          </div>
        </div>

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
