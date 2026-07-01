import "@/css/plant.css";
import "@/css/detail.css";
import { formatDate, formatDuration } from "@/utils/dateUtils";
import PlantView, { getLeafColors } from "@/views/PlantView";

export default function DetailView(props) {
  function deleteIdeaACB() {
    props.onDeleteIdea();
  }

  function renderResult() {
    const {leafColor, leafColorDk} = getLeafColors(props.idea);
    const style = "background-image: linear-gradient(to bottom left, " + leafColor +", " + leafColorDk + ")";
    const paintId = "gradient_leaf_detail_" + props.idea.epoch;
    const paintIdMobile = "gradient_leaf_mobile_detail_" + props.idea.epoch;

    return (
      <>
        <div class="idea-growth__bg" style={style}>
          <div class="idea-growth">
            <p class="idea__result">{props.idea.result}</p>
          </div>
        </div>

        <div class="idea-growth__bg__hang">
          <svg class="idea-growth__bg__hang__svg--desktop" width="100%" height="auto" viewBox="0 0 32 8">
            <path
              d="M2 8C3.10457 8 4 7.10457 4 6C4 7.10457 4.89543 8 6 8C7.10457 8 8 7.10457 8 6C8 7.10457 8.89543 8 10 8C11.1046 8 12 7.10457 12 6C12 7.10457 12.8954 8 14 8C15.1046 8 16 7.10457 16 6C16 7.10457 16.8954 8 18 8C19.1046 8 20 7.10457 20 6C20 7.10457 20.8954 8 22 8C23.1046 8 24 7.10457 24 6C24 7.10457 24.8954 8 26 8C27.1046 8 28 7.10457 28 6C28 7.10457 28.8954 8 30 8C31.1046 8 32 7.10457 32 6V0H0V6C0 7.10457 0.89543 8 2 8Z"
              fill={"url(#" + paintId + ")"}
            />
            <defs>
              <linearGradient id={paintId} x1="32" y1="0" x2="28.2353" y2="15.0588" gradientUnits="userSpaceOnUse">
                <stop stop-color={leafColor} />
                <stop offset="1" stop-color={leafColorDk} />
              </linearGradient>
            </defs>
          </svg>

          <svg class="idea-growth__bg__hang__svg--mobile" width="100%" height="auto" viewBox="0 0 20 8">
            <path
              d="M2 8C3.10457 8 4 7.10457 4 6C4 7.10457 4.89543 8 6 8C7.10457 8 8 7.10457 8 6C8 7.10457 8.89543 8 10 8C11.1046 8 12 7.10457 12 6C12 7.10457 12.8954 8 14 8C15.1046 8 16 7.10457 16 6C16 7.10457 16.8954 8 18 8C19.1046 8 20 7.10457 20 6V0H0V6C0 7.10457 0.89543 8 2 8Z"
              fill={"url(#" + paintIdMobile + ")"}
            />
            <defs>
              <linearGradient id={paintIdMobile} x1="20" y1="0" x2="14.4828" y2="13.7931" gradientUnits="userSpaceOnUse">
                <stop stop-color={leafColor} />
                <stop offset="1" stop-color={leafColorDk} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </>
    );
  }

  const wateredCaption = " · Watered "
    + (props.idea.wateringCount === 1 ? " once" : props.idea.wateringCount + " times")
    + " after " + formatDuration(props.idea.epochGrown, props.idea.epoch);

  return (
    <div class="detail-view">
      <div class="detail__content">
        <h1 class="idea__title">{props.idea.name || "Unwatered Idea"}</h1>
        <div class="idea__prompt">
          <div class="idea__prompt__texts">
            <p class="idea__prompt__text">{props.idea.prompt}</p>
            <p class="caption caption--indented">{"Planted " + formatDate(props.idea.epoch)
              + (props.idea.epochGrown ? wateredCaption : "")}
            </p>
          </div>
        </div>

        {props.idea.result && renderResult()}

        <div class="plant__container">
          <PlantView
            class="plant--detail"
            idea={props.idea}
            showLeaves={false}
            showWaterProgress={props.isPlantBeingWatered}
            waterProgress={props.isLoading ? 1 : props.waterProgress}
            isLoading={props.isLoading && props.isPlantBeingWatered}
          />
        </div>
      </div>

      <footer class="detail__footer">
        <button class="button--delete caption" onClick={deleteIdeaACB}>Delete idea</button>
      </footer>
    </div>
  );
}
