import "@/css/home.css";
import useFlowStore from "@/stores/flowStore";
import { ArrowUp } from 'lucide-vue-next';
import PlantView from "./PlantView";

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
    const ideaDate = new Date(idea.epoch);
    const now = new Date();
    let dateString = "";

    if (ideaDate.getDate() === now.getDate()
      && ideaDate.getMonth() === now.getMonth()
      && ideaDate.getFullYear() === now.getFullYear()) {

      const options = {hour: "numeric", minute: "numeric", hour12: false};
      dateString = ideaDate.toLocaleTimeString(undefined, options);
    }
    else {
      const options = {day: "numeric", month: "short"};
      if (ideaDate.getFullYear() !== now.getFullYear()) options.year = "numeric";

      dateString = ideaDate.toLocaleDateString(undefined, options);
    }

    return (
      <RouterLink to={"/idea/" + idea.epoch} class="item">
        <PlantView
          idea={idea}
          waterProgress={useFlowStore().waterProgress}
          showWaterProgress={!props.isLoading && idea.epoch == props.plantBeingWateredEpoch} />
        <h3 class="item__name">{idea.name || "???"}</h3>
        <p class="item__date">{"Planted " + dateString}</p>
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
