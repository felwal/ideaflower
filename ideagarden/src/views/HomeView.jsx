import "@/css/home.css";
import "@/css/plant.css";
import { ArrowDownToDot } from 'lucide-vue-next';
import PlantView from "./PlantView";
import { formatDate } from "@/utils/dateUtils";
import LoadingView from "./LoadingView";

export default function HomeView(props) {
  function sendPrompt() {
    const composerEl = document.getElementById("prompt");
    const prompt = composerEl.innerText.trim();

    if (prompt === "") return;

    composerEl.innerText = "";
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

  function onPromptEditACB(evt) {
    const composerEl = evt.target;

    if (!composerEl.innerText) {
      // remove the <br> that appears and prevents placeholder from reappearing after deleting all text
      composerEl.removeChild(composerEl.lastChild);
      // avoid cursor jumping to end after ctrl-a + delete
      composerEl.innerText = "";
    }
  }

  function renderIdea(idea) {
    return (
      <RouterLink to={"/idea/" + idea.epoch} class="item">
        {idea.result && !idea.read &&
          <div class="item__unread"></div>
        }

        <PlantView
          idea={idea}
          waterProgress={props.isLoading ? 1 : props.waterProgress}
          showWaterProgress={idea.epoch === props.plantBeingWateredEpoch}
          isLoading={props.isLoading && idea.epoch === props.plantBeingWateredEpoch}
        />

        <h3 class="item__name">{idea.name || "Ungrown Idea"}</h3>
        <p class="caption item__date">{"Planted " + formatDate(idea.epoch)}</p>
      </RouterLink>
    );
  }

  return (
    <div class="home-view">
      <div class="home-content">
        <h1>Your idea garden</h1>

        <div class="composer input-button-row column">
          <p
            class="input composer__input"
            id="prompt"
            type="text"
            contenteditable="plaintext-only"
            autocapitalize="sentences"
            data-placeholder="Plant an idea to grow ..."
            onInput={onPromptEditACB.bind(this)}
            onKeydown={addPromptOnKeyACB}
            aria-disabled={!props.isSignedIn}>
          </p>

          <button class="composer__button" onClick={addPromptOnClickACB} disabled={!props.isSignedIn}>
            <ArrowDownToDot color="currentColor" />
          </button>
        </div>

        {props.isInitialized
          ? <div class="stack">{props.ideas.reverse().map(renderIdea)}</div>
          : <LoadingView />
        }
      </div>
    </div>
  );
}
