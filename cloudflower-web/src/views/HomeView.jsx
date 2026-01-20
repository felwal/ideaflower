import "@/css/home.css";
import useFlowStore from "@/stores/flowStore";
import { ArrowDownToDot } from 'lucide-vue-next';
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
          showWaterProgress={!props.isLoading && idea.epoch === props.plantBeingWateredEpoch} />
        <h3 class="item__name">{idea.name || "???"}</h3>
        <p class="caption item__date">{"Planted " + formatDate(idea.epoch)}</p>
      </RouterLink>
    );
  }

  return (
    <div class="home-view">
      <div class="home-content">
        <h1>Your idea garden</h1>

        <div class="composer input-btn-row column">
          <input class="composer__input" id="prompt" type="text" placeholder="Plant an idea to grow ..." onKeydown={addPromptOnKeyACB} disabled={!props.isSignedIn} />
          <button class="composer__button" onClick={addPromptOnClickACB} disabled={!props.isSignedIn}>
            <ArrowDownToDot color="currentColor" />
          </button>
        </div>

        <div class="stack">
          {props.ideas.reverse().map(renderIdea)}
        </div>
      </div>
    </div>
  );
}
