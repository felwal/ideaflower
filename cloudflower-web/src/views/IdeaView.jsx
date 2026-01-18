import "@/css/detail.css";

export default function IdeaView(props) {
  return (
    <div class="idea-view">
      <h1>{props.idea.name || "Could not find idea"}</h1>
      <p>{props.idea.result}</p>
      <p>{props.idea.prompt}</p>
    </div>
  );
}
