import "@/css/detail.css";
import PlantView, { getLeafColors } from "./PlantView";
import { formatDate } from "@/utils/dateUtils";

export default function IdeaView(props) {
  const {leafColor, leafColorDk} = getLeafColors(props.idea);
  const style = "background-image: linear-gradient(to bottom left, " + leafColor +", " + leafColorDk + ")";

  return (
    <div class="idea-view">
      <div class="idea-growth__bg" style={style}>
        <div class="idea-growth">
          <h1 class="idea__title">{props.idea.name || "Could not find idea"}</h1>
          <p class="idea__result">{props.idea.result}</p>
        </div>
      </div>

      <div class="plant__container">
        <PlantView
          class="plant--detail"
          idea={props.idea}
          showLeaves={false}
          showWaterProgress={false} />
      </div>

      <div class="idea__prompt">
        <div class="idea__seed"></div>
        <div class="idea__prompt__texts">
          <p class="idea__prompt__text">{props.idea.prompt}</p>
          <p class="idea__date caption">{"Planted " + formatDate(props.idea.epoch)}</p>
        </div>
      </div>
    </div>
  );
}
