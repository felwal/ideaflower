import useFlowStore from "@/stores/flowStore";

export default function MainView(props) {
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

  function renderMessage(msg) {
    return <li>{msg.text /*+ " (" + new Date(msg.epoch).toLocaleString() + ")"*/}</li>;
  }

  return <div>
    <h1>Main</h1>
    <p>Water level: {props.waterLevel}</p>
    <ul>{props.conversation.map(renderMessage)}</ul>
    <input id="prompt" type="text" placeholder="Enter a prompt ..." onKeydown={addPromptOnKeyACB} disabled={!useFlowStore().user} />
    <button onClick={addPromptOnClickACB} disabled={!props.isSignedIn}>Send</button>
  </div>;
}
