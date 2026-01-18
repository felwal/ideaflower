import "@/css/home.css";
import useFlowStore from "@/stores/flowStore";
import { ArrowUp } from 'lucide-vue-next';
import PlantView from "./PlantView";
import { formatDate } from "@/utils/dateUtils";

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

  function waterClickACB(evt) {
    props.onAddWater();
  }

  function renderIdea(idea) {
    return (
      <RouterLink to={"/idea/" + idea.epoch} class="item">
        <PlantView
          idea={idea}
          waterProgress={useFlowStore().waterProgress}
          showWaterProgress={!props.isLoading && idea.epoch == props.plantBeingWateredEpoch} />
        <h3 class="item__name">{idea.name || "???"}</h3>
        <p class="caption item__date">{"Planted " + formatDate(idea.epoch)}</p>
      </RouterLink>
    );
  }

  return (
    <div class="home-view">
      <div class="home-content">
        <h1>Home</h1>
        <p>Water level: {props.waterLevel}</p>
        <button onClick={waterClickACB}>Add water</button>

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
