import { useWaterStore } from "@/stores/waterStore";

export default function MainView(props) {
  function sendPrompt() {
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput.value.trim();

    if (prompt === "") return;

    promptInput.value = "";
    props.onSendPrompt(prompt);
  }

  function addPromptOnKeyAcb(evt) {
    if (evt.key === "Enter") {
      sendPrompt();
    }
  }

  function addPromptOnClickAcb(evt) {
    sendPrompt();
  }

  function renderMessage(msg) {
    return <li>{msg.text /*+ " (" + new Date(msg.epoch).toLocaleString() + ")"*/}</li>;
  }

  return <div>
    <h1>Main</h1>
    <ul>{props.conversation.map(renderMessage)}</ul>
    <input id="prompt" type="text" placeholder="Enter a prompt ..." onKeydown={addPromptOnKeyAcb} disabled={!useWaterStore().user} />
    <button onClick={addPromptOnClickAcb} disabled={!useWaterStore().user}>Send</button>
  </div>;
}
