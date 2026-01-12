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
      <li>{idea.prompt}
        <ul>
          <li>{idea.name}</li>
          <li>{new Date(idea.epoch).toLocaleString()}</li>
          <li>{idea.result}</li>
        </ul>
      </li>
    );
  }

  return (
    <div class="home-view">
      <div class="home-content">
        <h1>Home</h1>
        <p>Water level: {props.waterLevel}</p>
        <ul>
          {props.ideas.map(renderIdea)}
          {props.isLoaing ? <li>...</li> : null}
        </ul>
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
